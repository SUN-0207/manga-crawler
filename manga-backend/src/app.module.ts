import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MangaModule } from './modules/manga/manga.module';
import { LoggerMiddleware } from './common/middlewares/logger.middlewares';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI ?? ''),
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
