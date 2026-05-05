class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404);
  }
}

class ConflictError extends AppError {
  constructor(message) {
    super(message, 409);
  }
}

class ValidationAppError extends AppError {
  constructor(errors) {
    super("Validation failed.", 422);
    this.errors = errors;
  }
}

module.exports = { AppError, NotFoundError, ConflictError, ValidationAppError };
