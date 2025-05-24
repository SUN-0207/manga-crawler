import { Module } from '@nestjs/common';
import { MangaController } from './manga.controller';
import { MangaService } from './manga.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MangaSchema } from './manga.schema';
import { MangaRepository } from './manga.repository';
import { ChapterSchema } from './chapter.schema';
import { CommentSchema } from './comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'manga', schema: MangaSchema },
      { name: 'chapter', schema: ChapterSchema },
      { name: 'comment', schema: CommentSchema },
    ]),
  ],
  controllers: [MangaController],
  providers: [MangaService, MangaRepository],
})
export class MangaModule {}
