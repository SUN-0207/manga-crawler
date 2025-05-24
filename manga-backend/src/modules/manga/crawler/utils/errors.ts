export class MangaCrawlerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MangaCrawlerError';
  }
}

export class NetworkError extends MangaCrawlerError {
  constructor(message: string, public readonly statusCode?: number) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ParsingError extends MangaCrawlerError {
  constructor(message: string, public readonly source?: string) {
    super(message);
    this.name = 'ParsingError';
  }
}

export class DownloadError extends MangaCrawlerError {
  constructor(message: string, public readonly url?: string) {
    super(message);
    this.name = 'DownloadError';
  }
}

export class ValidationError extends MangaCrawlerError {
  constructor(message: string, public readonly field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends MangaCrawlerError {
  constructor(message: string, public readonly retryAfter?: number) {
    super(message);
    this.name = 'RateLimitError';
  }
} 