export class BaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class RateLimitError extends BaseError {
  constructor(message: string) {
    super(message);
  }
}

export class WhatsAppError extends BaseError {
  constructor(message: string) {
    super(message);
  }
}

export class DatabaseError extends BaseError {
  constructor(message: string) {
    super(message);
  }
} 