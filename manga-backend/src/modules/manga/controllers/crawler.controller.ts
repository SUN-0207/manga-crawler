import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MangaCrawlerService } from '../crawler/manga-crawler.service';
import { MangaItem } from '../crawler/interfaces/manga.interface';

@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: MangaCrawlerService) {}

  @Get('manga-list')
  async getMangaList(): Promise<MangaItem[]> {
    return this.crawlerService.getCurrentMangaData();
  }

  @Post('crawl')
  async crawlManga(): Promise<MangaItem[]> {
    return this.crawlerService.crawlAllManga();
  }

  @Post('download/:mangaUrl')
  async downloadManga(@Param('mangaUrl') mangaUrl: string): Promise<void> {
    await this.crawlerService.downloadSelectedManga(mangaUrl);
  }
} 