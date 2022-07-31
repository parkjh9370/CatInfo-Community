import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import * as mongoose from 'mongoose';

@Module({
  imports: [
    /// 환경변수 사용
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    }),
    CatsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  private readonly isDev: boolean = process.env.MODE === 'dev' ? true : false;

  // LoggerMiddleware(공급자)를 AppModule 소비자에 등록시켜 줌
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // 전체 엔드포인트에 대한 로깅
    mongoose.set('debug', this.isDev); // 몽구스 데이터 쿼리 (개발 시 출력)
  }
}

/**
 * 의존성 주입
 * AppController : 소비자
 * AppService: 제품
 * 공급자가 제공해주는 제품을 소비자가 사용하고 있음
 * Provider: 공급자
 */
