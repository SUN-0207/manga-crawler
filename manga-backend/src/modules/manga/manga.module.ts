import { MongooseModule } from "@nestjs/mongoose";
import { MangaController } from "./controllers/manga.controller";
import { CrawlerController } from "./controllers/crawler.controller";
import { MangaRepository } from "./repositories/manga.repository";
import { ChapterRepository } from "./repositories/chapter.repository";
import { ChapterSchema } from "./schemas/chapter.schema";
import { CommentSchema } from "./schemas/comment.schema";
import { MangaService } from "./services/manga.service";
import { Module } from "@nestjs/common";
import { MangaSchema } from "./schemas/manga.schema";
import { MangaCrawlerService } from './crawler/manga-crawler.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'manga', schema: MangaSchema },
      { name: 'chapter', schema: ChapterSchema },
      { name: 'comment', schema: CommentSchema },
    ]),
  ],
  controllers: [MangaController, CrawlerController],
  providers: [MangaService, MangaRepository, ChapterRepository, MangaCrawlerService],
})
export class MangaModule {}
