import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { DownloadError } from './errors';

export class DownloadManager {
  private static instance: DownloadManager;
  private downloadQueue: Promise<void>[] = [];
  private maxConcurrent: number;

  private constructor(maxConcurrent = 5) {
    this.maxConcurrent = maxConcurrent;
  }

  public static getInstance(maxConcurrent?: number): DownloadManager {
    if (!DownloadManager.instance) {
      DownloadManager.instance = new DownloadManager(maxConcurrent);
    }
    return DownloadManager.instance;
  }

  public async queueDownload(url: string, filePath: string): Promise<void> {
    const downloadPromise = this.download(url, filePath);
    this.downloadQueue.push(downloadPromise);
    await downloadPromise;
  }

  private async download(url: string, filePath: string): Promise<void> {
    try {
      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream',
      });

      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
    } catch (error) {
      throw new DownloadError(`Failed to download file from ${url}`, url);
    }
  }

  public async waitForAll(): Promise<void> {
    await Promise.all(this.downloadQueue);
    this.downloadQueue = [];
  }
} 