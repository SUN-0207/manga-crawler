import fs from 'fs';
import { LOG_FILE } from '../config/constants';

export class Logger {
  private static instance: Logger;
  
  private constructor() {
    this.clearLogs();
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private async clearLogs(): Promise<void> {
    try {
      await fs.promises.writeFile(LOG_FILE, '', 'utf8');
      console.info('Log file cleared successfully');
    } catch (error) {
      console.error('Error clearing log file:', error);
    }
  }

  private getCurrentTime(): string {
    return new Date().toTimeString().split(" ")[0];
  }

  public async log(message: string, level: 'info' | 'error' | 'warn' = 'info'): Promise<void> {
    const time = this.getCurrentTime();
    const logMessage = `[${time}][${level.toUpperCase()}] ${message}\n`;
    
    console[level](message);
    
    await fs.promises.appendFile(LOG_FILE, logMessage, 'utf8').catch(err => {
      console.error('Error writing to log file:', err);
    });
  }

  public async error(message: string, error?: unknown): Promise<void> {
    const errorMessage = error instanceof Error ? error.message : String(error);
    await this.log(`${message}: ${errorMessage}`, 'error');
  }

  public async warn(message: string): Promise<void> {
    await this.log(message, 'warn');
  }

  public async info(message: string): Promise<void> {
    await this.log(message, 'info');
  }
} 