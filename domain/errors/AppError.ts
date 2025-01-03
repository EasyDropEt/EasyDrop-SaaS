export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(
      `${resource} not found`,
      'RESOURCE_NOT_FOUND',
      404
    );
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(
      message,
      'VALIDATION_ERROR',
      400
    );
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor() {
    super(
      'Authentication required',
      'AUTHENTICATION_REQUIRED',
      401
    );
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor() {
    super(
      'Not authorized to perform this action',
      'UNAUTHORIZED',
      403
    );
    this.name = 'AuthorizationError';
  }
} 