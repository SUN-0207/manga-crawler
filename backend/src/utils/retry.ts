import { NetworkError, RateLimitError } from './errors';

interface RetryOptions {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

const defaultOptions: RetryOptions = {
  maxAttempts: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoffFactor: 2,
};

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const config = { ...defaultOptions, ...options };
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // If it's not a retryable error, throw immediately
      if (!isRetryableError(error)) {
        throw error;
      }

      // If we've reached max attempts, throw the last error
      if (attempt === config.maxAttempts) {
        throw lastError;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        config.initialDelay * Math.pow(config.backoffFactor, attempt - 1),
        config.maxDelay
      );

      // If it's a rate limit error, use the retry-after value if available
      if (error instanceof RateLimitError && error.retryAfter) {
        await new Promise(resolve => setTimeout(resolve, error.retryAfter! * 1000));
      } else {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

function isRetryableError(error: unknown): boolean {
  if (error instanceof NetworkError) {
    // Retry on 5xx errors and some 4xx errors
    const statusCode = error.statusCode;
    if (typeof statusCode === 'number') {
      return statusCode >= 500 || [408, 429, 503].includes(statusCode);
    }
    return false;
  }

  if (error instanceof RateLimitError) {
    return true;
  }

  // Don't retry other types of errors
  return false;
} 