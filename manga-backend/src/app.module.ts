import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MangaModule } from './modules/manga/manga.module';
import { LoggerMiddleware } from './common/middlewares/logger.middlewares';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://letmecook:son0949503358@smanga.y0vps0b.mongodb.net/manga_db',
    ),
    MangaModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
