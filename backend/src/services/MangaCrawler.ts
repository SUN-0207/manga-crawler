import { BrowserManager } from "../utils/BrowserManager";
import { DownloadManager } from "../utils/DownloadManager";
import { Logger } from "../utils/Logger";
import { DOMAIN, ROOT, SUB_DOMAIN } from "../config/constants";
import { MangaItem, DetailItem, Chapter, ImageData } from "../types";
import { Page } from "puppeteer";
import fs from "fs";
import path from "path";
import { withRetry } from "../utils/retry";
import {
  NetworkError,
  ParsingError,
  DownloadError,
  ValidationError,
} from "../utils/errors";

export class MangaCrawler {
  private browserManager: BrowserManager;
  private downloadManager: DownloadManager;
  private logger: Logger;

  constructor() {
    this.browserManager = BrowserManager.getInstance();
    this.downloadManager = DownloadManager.getInstance();
    this.logger = Logger.getInstance();
  }

  private async autoScroll(page: Page): Promise<void> {
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const scrollInterval = setInterval(() => {
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= document.body.scrollHeight) {
            clearInterval(scrollInterval);
            resolve();
          }
        }, 100);
      });
    });
  }

  private async getItems(index: number): Promise<MangaItem[]> {
    const url = SUB_DOMAIN.replace("page_index", String(index));
    await this.logger.info(`Fetching items from page ${index}: ${url}`);

    try {
      return await withRetry(async () => {
        return this.browserManager.withPage(async (page) => {
          try {
            await page.goto(url, { waitUntil: "networkidle0" });
            await this.autoScroll(page);
            await this.logger.info(`Successfully loaded page ${index}`);

            const items = await page.evaluate(() => {
              const result: MangaItem[] = [];
              const itemMangaElements =
                document.querySelectorAll(".item-manga");

              if (!itemMangaElements.length) {
                throw new ParsingError("No manga items found on the page");
              }

              itemMangaElements.forEach((element) => {
                try {
                  const item: MangaItem = {
                    imageItem: {
                      link:
                        element
                          .querySelector(".image-item a")
                          ?.getAttribute("href") || "",
                      image:
                        element
                          .querySelector(".image-item img")
                          ?.getAttribute("src") || "",
                      title:
                        element
                          .querySelector(".title span")
                          ?.textContent?.trim() || "",
                      infoManga: {
                        eye:
                          element
                            .querySelectorAll(".image-item .info-manga span")[0]
                            ?.textContent?.trim() || "",
                        comment:
                          element
                            .querySelectorAll(".image-item .info-manga span")[1]
                            ?.textContent?.trim() || "",
                        heart:
                          element
                            .querySelectorAll(".image-item .info-manga span")[2]
                            ?.textContent?.trim() || "",
                      },
                    },
                    mangaInformation: {
                      title:
                        element
                          .querySelector(".manga-information .title span")
                          ?.textContent?.trim() || "",
                      image:
                        element
                          .querySelector(".manga-information .image-mini img")
                          ?.getAttribute("data-original") || "",
                      synopsis: {
                        genres:
                          element
                            .querySelectorAll(".synopsis p")[0]
                            ?.textContent?.split(":")[1]
                            ?.trim()
                            ?.split(",")
                            .map((text) => text.trim()) || [],
                        view:
                          element
                            .querySelectorAll(".synopsis p")[1]
                            ?.textContent?.split(":")[1]
                            ?.trim() || "",
                        status:
                          element
                            .querySelectorAll(".synopsis p")[2]
                            ?.textContent?.split(":")[1]
                            ?.replace(/\s+/g, " ")
                            .trim() || "",
                        comment:
                          element
                            .querySelectorAll(".synopsis p")[3]
                            ?.textContent?.split(":")[1]
                            ?.trim() || "",
                        subscriber:
                          element
                            .querySelectorAll(".synopsis p")[4]
                            ?.textContent?.split(":")[1]
                            ?.trim() || "",
                        like:
                          element
                            .querySelectorAll(".synopsis p")[5]
                            ?.textContent?.split(":")[1]
                            ?.replace(/\s+/g, " ")
                            .trim() || "",
                        updateTime:
                          element
                            .querySelectorAll(".synopsis p")[6]
                            ?.textContent?.split(":")[1]
                            ?.replace(/\s+/g, " ")
                            .trim() || "",
                      },
                    },
                    contentManga:
                      element
                        .querySelector(".content-manga p")
                        ?.textContent?.replace(/\s+/g, " ")
                        .trim() || "",
                  };

                  // Validate required fields
                  if (!item.imageItem.link || !item.imageItem.title) {
                    throw new ValidationError(
                      "Missing required fields",
                      "imageItem"
                    );
                  }

                  result.push(item);
                } catch (error) {
                  if (error instanceof Error) {
                    throw new ParsingError(
                      `Error processing manga item: ${error.message}`
                    );
                  }
                  throw error;
                }
              });

              return result;
            });

            await this.logger.info(
              `Found ${items.length} manga items on page ${index}`
            );

            // Fetch additional details for each item with rate limiting
            const processedItems: MangaItem[] = [];
            for (const item of items) {
              try {
                await this.logger.info(
                  `Fetching details for manga: ${item.imageItem.title}`
                );
                item.detail = await this.getDetailItem(item.imageItem.link);
                processedItems.push(item);

                // Add a small delay between requests to avoid overwhelming the server
                await new Promise((resolve) => setTimeout(resolve, 1000));
              } catch (error) {
                await this.logger.error(
                  `Failed to fetch details for manga: ${item.imageItem.title}`,
                  error
                );
                // Continue with next item even if this one fails
              }
            }

            await this.logger.info(
              `Successfully processed ${processedItems.length} items on page ${index}`
            );
            return processedItems;
          } catch (error) {
            if (error instanceof Error) {
              throw new NetworkError(
                `Failed to fetch page ${index}: ${error.message}`
              );
            }
            throw error;
          }
        });
      });
    } catch (error) {
      await this.logger.error(
        `Failed to fetch items from page ${index}`,
        error
      );
      throw error;
    }
  }

  public async getDetailItem(url: string): Promise<DetailItem> {
    return withRetry(async () => {
      return this.browserManager.withPage(async (page) => {
        try {
          await page.goto(url);
          await this.logger.info(`Fetching manga details from: ${url}`);

          return page.evaluate(() => {
            const titleElement = document.querySelector(".title-manga");
            if (!titleElement) {
              throw new ParsingError("Could not find manga title element");
            }

            const detail: DetailItem = {
              titleManga: titleElement.textContent || "",
              timeUpdate: (
                document.querySelector(".time-update")?.textContent || ""
              )
                .replace(/-?\s*Cập nhật\s+lúc:/g, "")
                .replace(/\n/g, " ")
                .replace(/\s+/g, " ")
                .trim()
                .replace(/-$/, "")
                .trim(),
              overViewComic: {
                imageInfo:
                  document
                    .querySelector(".image-info img")
                    ?.getAttribute("src") || "",
                infoDetailComic: {
                  nameOther: (
                    document.querySelector(
                      ".info-detail-comic .name-other .detail-info"
                    )?.textContent || ""
                  )
                    .replace(/\n/g, " ")
                    .replace(/\s+/g, " ")
                    .trim(),
                  author: (
                    document.querySelector(
                      ".info-detail-comic .author .detail-info"
                    )?.textContent || ""
                  )
                    .replace(/\n/g, " ")
                    .replace(/\s+/g, " ")
                    .trim(),
                  status: (
                    document.querySelector(
                      ".info-detail-comic .status .detail-info"
                    )?.textContent || ""
                  )
                    .replace(/\n/g, " ")
                    .replace(/\s+/g, " ")
                    .trim(),
                  category: Array.from(
                    document.querySelectorAll(
                      ".info-detail-comic .category .detail-info .cat-detail a"
                    )
                  ).map((el) => (el as HTMLElement).textContent?.trim() || ""),
                  translateGroup:
                    document.querySelector(
                      ".info-detail-comic .translate-group .detail-info"
                    )?.textContent || "",
                  viewTotal:
                    document.querySelector(
                      ".info-detail-comic .view-total .detail-info"
                    )?.textContent || "",
                  viewLike:
                    document.querySelector(
                      ".info-detail-comic .view-like .detail-info"
                    )?.textContent || "",
                  totalFollow: (
                    document.querySelector(
                      ".info-detail-comic .total-follow .detail-info"
                    )?.textContent || ""
                  )
                    .replace(/\n/g, " ")
                    .replace(/\s+/g, " ")
                    .trim(),
                },
              },
              chapters: [],
            };

            const chapterList = document.querySelectorAll(".chapters a");
            if (!chapterList.length) {
              throw new ParsingError("No chapters found for manga");
            }

            detail.chapters = Array.from(chapterList).map((chapter) => ({
              name: chapter.textContent?.trim() || "",
              link: chapter.getAttribute("href") || "",
            }));

            return detail;
          });
        } catch (error) {
          if (error instanceof Error) {
            throw new NetworkError(
              `Failed to fetch manga details: ${error.message}`
            );
          }
          throw error;
        }
      });
    });
  }

  private async getChapterImages(url: string): Promise<ImageData[]> {
    return withRetry(async () => {
      return this.browserManager.withPage(async (page) => {
        try {
          await page.goto(url);
          await this.logger.info(`Fetching chapter images from: ${url}`);

          return page.evaluate(() => {
            const imageList = document.querySelectorAll(".page-chapter img");
            if (!imageList.length) {
              throw new ParsingError("No images found in chapter");
            }

            return Array.from(imageList).map((image) => ({
              alt: image.getAttribute("alt") || "",
              src: image.getAttribute("src") || "",
              dataIndex: image.getAttribute("data-index") || "",
            }));
          });
        } catch (error) {
          if (error instanceof Error) {
            throw new NetworkError(
              `Failed to fetch chapter images: ${error.message}`
            );
          }
          throw error;
        }
      });
    });
  }

  public async downloadChapter(
    chapter: Chapter,
    mangaFolder: string
  ): Promise<void> {
    const chapterFolder = path.join(mangaFolder, chapter.name);
    await this.logger.info(`Processing chapter: ${chapter.name}`);

    try {
      const images = await this.getChapterImages(chapter.link);

      const downloadPromises = images.map((image) => {
        const imageUrl = image.src.includes("https")
          ? image.src
          : `https:${image.src}`;
        const imagePath = path.join(chapterFolder, `${image.alt}.jpg`);
        return withRetry(
          () => this.downloadManager.queueDownload(imageUrl, imagePath),
          { maxAttempts: 5 } // More attempts for downloads
        );
      });

      await Promise.all(downloadPromises);
      await this.logger.info(`Completed downloading chapter: ${chapter.name}`);
    } catch (error) {
      await this.logger.error(
        `Failed to process chapter: ${chapter.name}`,
        error
      );
      throw new DownloadError(
        `Failed to download chapter ${chapter.name}`,
        chapter.link
      );
    }
  }

  public async downloadManga(mangaUrl: string): Promise<void> {
    try {
      const detail = await this.browserManager.retry(() =>
        this.getDetailItem(mangaUrl)
      );

      const mangaFolder = path.join("data", ROOT, detail.titleManga);

      for (const chapter of detail.chapters) {
        try {
          await this.downloadChapter(chapter, mangaFolder);
        } catch (error) {
          await this.logger.error(
            `Failed to download chapter ${chapter.name}`,
            error
          );
          // Continue with next chapter
        }
      }

      await this.downloadManager.waitForAll();
      await this.logger.info(
        `Completed downloading manga: ${detail.titleManga}`
      );
    } catch (error) {
      await this.logger.error("Failed to download manga", error);
      throw error;
    }
  }

  private async writeMangaData(
    mangaItems: MangaItem[],
    outputPath: string
  ): Promise<void> {
    try {
      // Ensure the data directory exists
      const dataDir = path.dirname(outputPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // Write the new data directly to file
      await fs.promises.writeFile(
        outputPath,
        JSON.stringify(mangaItems, null, 2),
        "utf8"
      );

      await this.logger.info(
        `Successfully wrote ${mangaItems.length} manga items to ${outputPath}`
      );
    } catch (error) {
      await this.logger.error(
        `Failed to write manga data to ${outputPath}`,
        error
      );
      throw error;
    }
  }

  public async crawlAllManga(): Promise<MangaItem[]> {
    try {
      const maxPageIndex = await this.browserManager.withPage(async (page) => {
        await page.goto(DOMAIN);
        await this.logger.info("Navigated to domain page");

        return page.evaluate(() => {
          const ul = document.querySelector(".pagination");
          if (!ul) {
            return 0;
          }

          const items = Array.from(ul.querySelectorAll(".page-item")).map(
            (li) => {
              const index = Number((li as HTMLElement).textContent?.trim());
              return isNaN(index) ? 0 : index;
            }
          );

          const max = Math.max(...items);
          return max;
        });
      });
      await this.logger.info(`Maximum page index found: ${maxPageIndex}`);

      const mangaItems: MangaItem[] = [];
      for (let index = 1; index <= 1; index++) {
        await this.logger.info(`Processing page ${index} of ${maxPageIndex}`);
        const pageUrl = SUB_DOMAIN.replace("page_index", index.toString());
        await this.logger.info(`Processing page url ${pageUrl}`);
        const items = await this.getItems(index);
        mangaItems.push(...items);
      }
      await this.logger.info(`Total manga items found: ${mangaItems.length}`);

      // Write manga items to JSON file
      const outputPath = path.join("data", "mangaData.json");
      await this.writeMangaData(mangaItems, outputPath);

      return mangaItems;
    } finally {
      await this.browserManager.closeBrowser();
    }
  }

  public async getCurrentMangaData(): Promise<MangaItem[]> {
    const filePath = path.join("data", "mangaData.json");

    try {
      this.logger.info(`Fetching current manga data from: ${filePath}`);

      const fileData = await fs.promises.readFile(filePath, "utf8");
      const parsed = JSON.parse(fileData);

      if (Array.isArray(parsed)) {
        return parsed;
      } else {
        this.logger.warn("Parsed manga data is not an array");
        return [];
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Error reading manga data file: ${message}`);
      return [];
    }
  }

  public async downloadSelectedManga(mangaUrl: string): Promise<void> {
    try {
      await this.downloadManga(mangaUrl);
    } catch (error) {
      await this.logger.error("Failed to download selected manga", error);
      throw error;
    }
  }
}
