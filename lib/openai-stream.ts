import {OpenAIError} from './errors/openai-errors';
import {createStreamErrorEvent} from './api/response';
import {Stream} from 'openai/streaming';
import {ChatCompletionChunk} from 'openai/resources/chat/completions';


export type OpenAIStreamType = Stream<ChatCompletionChunk>;

export type StreamControllers = {
    controller: AbortController;
};

export function OpenAIStream(
    response: OpenAIStreamType,
    controllers: StreamControllers,
    onError?: (error: Error) => void
) {
    const encoder = new TextEncoder();
    // const decoder = new TextDecoder();

    return new ReadableStream({
        async start(controller) {
            try {
                for await (const chunk of response) {
                    const content = chunk.choices[0]?.delta?.content || '';
                    if (content) {
                        controller.enqueue(encoder.encode(content));
                    }
                }
                controller.close();
            } catch (error) {
                const err = error instanceof Error ? error : new Error('Unknown error');

                // Call error handler if provided
                if (onError) {
                    onError(err);
                }

                // Send error event to client
                const openAIError = new OpenAIError(err.message);
                controller.enqueue(encoder.encode(createStreamErrorEvent(openAIError)));
                controller.close();
            }
        },

        cancel() {
            // Handle client disconnection
            controllers.controller.abort();
        },
    });
}