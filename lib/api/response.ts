import { NextResponse } from 'next/server';
import { APIError } from '../errors/api-errors';

export interface APIErrorResponse {
    error: {
        code: string;
        message: string;
        details?: unknown;
        requestId?: string;
    };
}

export interface APISuccessResponse<T> {
    data: T;
    meta?: Record<string, unknown>;
}

export function createErrorResponse(error: APIError, requestId?: string): NextResponse<APIErrorResponse> {
    const response: APIErrorResponse = {
        error: {
            code: error.code,
            message: error.message,
            details: error.details,
            requestId,
        },
    };

    return NextResponse.json(response, { status: error.statusCode });
}

export function createSuccessResponse<T>(
    data: T,
    meta?: Record<string, unknown>
): NextResponse<APISuccessResponse<T>> {
    return NextResponse.json({ data, meta }, { status: 200 });
}

export function createStreamResponse(stream: ReadableStream): NextResponse {
    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}

// Helper for creating error events in a stream
export function createStreamErrorEvent(error: APIError): string {
    return `event: error\ndata: ${JSON.stringify({
        error: {
            code: error.code,
            message: error.message,
            details: error.details,
        },
    })}\n\n`;
}