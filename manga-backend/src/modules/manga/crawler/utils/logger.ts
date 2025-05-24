export class Logger {
  private static instance: Logger;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public async info(message: string): Promise<void> {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
  }

  public async error(message: string, error?: unknown): Promise<void> {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, errorMessage);
  }

  public async warn(message: string): Promise<void> {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`);
  }

  public async debug(message: string): Promise<void> {
    console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`);
  }
} 