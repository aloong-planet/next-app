import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
    APIError,
    ValidationError,
    AuthenticationError,
    RateLimitError,
    ConfigurationError
} from '../errors/api-errors';
import { createErrorResponse } from './response';
import { nanoid } from 'nanoid';

export interface APIContext {
    requestId: string;
    // Add more context properties as needed
}

type APIRouteHandler<T> = (
    req: NextRequest,
    context: APIContext
) => Promise<NextResponse<T>>;

export function createAPIHandler<T>(handler: APIRouteHandler<T>) {
    return async (req: NextRequest): Promise<NextResponse> => {
        const requestId = nanoid();
        const context: APIContext = {
            requestId
        };

        try {
            // Log request
            console.log(`[${requestId}] ${req.method} ${req.url}`);

            return await handler(req, context);

        } catch (error) {
            console.error(`[${requestId}] Error:`, error);

            // Handle known errors
            if (error instanceof APIError) {
                return createErrorResponse(error, requestId);
            }

            // Handle Zod validation errors
            if (error instanceof z.ZodError) {
                return createErrorResponse(
                    new ValidationError(error.errors),
                    requestId
                );
            }

            // Handle other types of errors
            if (error instanceof Error) {
                // Map specific error messages to custom errors
                if (error.message.includes('429')) {
                    return createErrorResponse(new RateLimitError(), requestId);
                }
                if (error.message.includes('401')) {
                    return createErrorResponse(new AuthenticationError(), requestId);
                }
                if (error.message.includes('configuration')) {
                    return createErrorResponse(new ConfigurationError(), requestId);
                }
            }

            // Handle unknown errors
            return createErrorResponse(
                new APIError('Internal Server Error', 500, 'INTERNAL_SERVER_ERROR'),
                requestId
            );
        }
    };
}

// Utility function to validate request body
export async function validateBody<T>(
    req: NextRequest,
    schema: z.Schema<T>
): Promise<T> {
    const body = await req.json();
    return schema.parse(body);
}