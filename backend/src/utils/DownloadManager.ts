import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { DOWNLOAD_CONFIG } from '../config/constants';
import { Logger } from './Logger';
import PQueue from 'p-queue';

export class DownloadManager {
  private static instance: DownloadManager;
  private queue: PQueue;
  private logger: Logger;

  private constructor() {
    this.queue = new PQueue({ concurrency: DOWNLOAD_CONFIG.concurrentDownloads });
    this.logger = Logger.getInstance();
  }

  public static getInstance(): DownloadManager {
    if (!DownloadManager.instance) {
      DownloadManager.instance = new DownloadManager();
    }
    return DownloadManager.instance;
  }

  private async ensureDirectory(directory: string): Promise<void> {
    if (!fs.existsSync(directory)) {
      await fs.promises.mkdir(directory, { recursive: true });
      await this.logger.info(`Created directory: ${directory}`);
    }
  }

  private async downloadFile(url: string, filePath: string): Promise<void> {
    const response = await axios.get(url, {
      responseType: 'stream',
      timeout: DOWNLOAD_CONFIG.timeout,
      headers: { referer: 'https://www.toptruyenww.pro' }
    });

    if (response.status !== 200) {
      throw new Error(`Unexpected response status: ${response.status}`);
    }

    const writer = fs.createWriteStream(filePath);

    await new Promise<void>((resolve, reject) => {
      response.data.pipe(writer);
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }

  public async downloadWithRetry(
    url: string, 
    filePath: string, 
    retryCount: number = DOWNLOAD_CONFIG.retryCount
  ): Promise<void> {
    await this.ensureDirectory(path.dirname(filePath));

    for (let i = 0; i < retryCount; i++) {
      try {
        await this.downloadFile(url, filePath);
        await this.logger.info(`Downloaded: ${filePath}`);
        return;
      } catch (error) {
        if (i === retryCount - 1) {
          throw error;
        }
        await this.logger.warn(`Retry ${i + 1}/${retryCount} for ${filePath}`);
        await new Promise(resolve => setTimeout(resolve, DOWNLOAD_CONFIG.retryDelay));
      }
    }
  }

  public async queueDownload(url: string, filePath: string): Promise<void> {
    return this.queue.add(async () => {
      try {
        await this.downloadWithRetry(url, filePath);
      } catch (error) {
        await this.logger.error(`Failed to download ${filePath}`, error);
        throw error;
      }
    });
  }

  public async waitForAll(): Promise<void> {
    await this.queue.onIdle();
  }
} 