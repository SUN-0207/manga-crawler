import puppeteer from 'puppeteer-extra';
import { Browser, Page } from 'puppeteer';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import { BROWSER_CONFIG } from '../config/constants';

export class BrowserManager {
  private static instance: BrowserManager;
  private browser: Browser | null = null;

  private constructor() {
    puppeteer.use(StealthPlugin());
    puppeteer.use(AdblockerPlugin({ blockTrackers: true }));
  }

  public static getInstance(): BrowserManager {
    if (!BrowserManager.instance) {
      BrowserManager.instance = new BrowserManager();
    }
    return BrowserManager.instance;
  }

  public async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({ 
        headless: BROWSER_CONFIG.headless,
        timeout: BROWSER_CONFIG.timeout
      });
    }
    return this.browser;
  }

  public async getPage(): Promise<Page> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();
    await page.setDefaultTimeout(BROWSER_CONFIG.timeout);
    return page;
  }

  public async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  public async withPage<T>(action: (page: Page) => Promise<T>): Promise<T> {
    let page: Page | null = null;
    try {
      page = await this.getPage();
      return await action(page);
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  public async retry<T>(
    action: () => Promise<T>, 
    retryCount: number = BROWSER_CONFIG.retryCount
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let i = 0; i < retryCount; i++) {
      try {
        return await action();
      } catch (error) {
        lastError = error as Error;
        if (i < retryCount - 1) {
          await new Promise(resolve => setTimeout(resolve, BROWSER_CONFIG.retryDelay));
        }
      }
    }
    
    throw lastError;
  }
} 