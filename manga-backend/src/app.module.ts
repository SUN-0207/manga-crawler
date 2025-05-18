import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MangaModule } from './modules/manga/manga.module';
import { LoggerMiddleware } from './common/middlewares/logger.middlewares';

@Module({
  imports: [MangaModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
