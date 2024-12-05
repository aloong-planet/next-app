import { openai } from '@/lib/openai';
import { OpenAIStream } from '@/lib/openai-stream';
import { createAPIHandler, validateBody } from '@/lib/api/handler';
import { createStreamResponse } from '@/lib/api/response';
import { ConfigurationError } from '@/lib/errors/api-errors';
import { OpenAIError } from '@/lib/errors/openai-errors';
import { z } from 'zod';

// Define request schema
const chatRequestSchema = z.object({
    chatId: z.string().uuid(),
    messages: z.array(
        z.object({
            role: z.enum(['user', 'assistant', 'system']),
            content: z.string(),
        })
    ),
});

export const POST = createAPIHandler(async (req, context) => {
    // Validate request body
    const body = await validateBody(req, chatRequestSchema);

    // Validate environment variables
    if (!process.env.AZURE_OPENAI_API_KEY ||
        !process.env.AZURE_OPENAI_ENDPOINT ||
        !process.env.AZURE_OPENAI_DEPLOYMENT_NAME) {
        throw new ConfigurationError('Azure OpenAI configuration is missing');
    }

    try {
        const controller = new AbortController();

        // Add system context about the chat session
        const contextualMessages = [
            {
                role: 'system' as const,
                content: `This is a continuation of chat session ${body.chatId}. Please provide relevant and contextual responses.`
            },
            ...body.messages
        ];

        // Create chat completion
        const response = await openai.chat.completions.create({
            model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
            messages: contextualMessages,
            stream: true,
            temperature: 0.7,
            max_tokens: 4096,
            user: body.chatId,
        });

        // Create stream with error handling
        const stream = OpenAIStream(
            response,
            {controller},
            (error) => {
                console.error(`[${context.requestId}] Stream error:`, error);
            }
        );

        // Return streaming response
        return createStreamResponse(stream);

    } catch (error) {
        // Log the error with context
        console.error(`[${context.requestId}] OpenAI API error:`, error);

        // Convert to OpenAI specific error
        if (error instanceof Error) {
            throw new OpenAIError(
                error.message,
                error.message.includes('429') ? 429 :
                    error.message.includes('401') ? 401 : 500
            );
        }

        // Re-throw unknown errors
        throw error;
    }
});