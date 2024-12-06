import { APIError } from './api-errors';

export class OpenAIError extends APIError {
    constructor(
        message: string,
        statusCode: number = 500,
        code: string = 'OPENAI_ERROR',
        details?: unknown
    ) {
        super(message, statusCode, code, details);
        this.name = 'OpenAIError';
    }
}

export class OpenAIRateLimitError extends OpenAIError {
    constructor(message = 'OpenAI rate limit exceeded') {
        super(message, 429, 'OPENAI_RATE_LIMIT_ERROR');
        this.name = 'OpenAIRateLimitError';
    }
}

export class OpenAIAuthenticationError extends OpenAIError {
    constructor(message = 'OpenAI authentication failed') {
        super(message, 401, 'OPENAI_AUTHENTICATION_ERROR');
        this.name = 'OpenAIAuthenticationError';
    }
}