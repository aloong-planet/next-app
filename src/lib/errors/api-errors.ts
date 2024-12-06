export class APIError extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public code: string,
        public details?: unknown
    ) {
        super(message);
        this.name = 'APIError';
    }
}

export class ValidationError extends APIError {
    constructor(details: unknown) {
        super('Validation Error', 400, 'VALIDATION_ERROR', details);
        this.name = 'ValidationError';
    }
}

export class AuthenticationError extends APIError {
    constructor(message = 'Authentication failed') {
        super(message, 401, 'AUTHENTICATION_ERROR');
        this.name = 'AuthenticationError';
    }
}

export class RateLimitError extends APIError {
    constructor(message = 'Rate limit exceeded') {
        super(message, 429, 'RATE_LIMIT_ERROR');
        this.name = 'RateLimitError';
    }
}

export class ConfigurationError extends APIError {
    constructor(message = 'Configuration error') {
        super(message, 500, 'CONFIGURATION_ERROR');
        this.name = 'ConfigurationError';
    }
}