import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';
import { NestExpressApplication } from '@nestjs/platform-express';
import path from 'path';

async function bootstrap() {
  // express app 제네릭 설정 (useStaticAssets 사용하기 위해)
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // class-validation 사용 등록
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger 접근 보안 설정
  app.use(
    ['/docs', '/docs-json'],
    expressBasicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
      },
    }),
  );

  // http://localhost:8000/media/cats/aaa.png

  // static 파일 제공
  // useStaticAssets는 nestApp 에서는 없기 때문에
  // express application이라고 제네릭 설정을 해줘야 함
  // common 폴더 안의 uploads
  app.useStaticAssets(path.join(__dirname, './common', 'uploads'), {
    // 경로에 media 추가
    prefix: '/media',
  });

  // Swagger 문서 설정
  const config = new DocumentBuilder()
    .setTitle('C.I.C')
    .setDescription('cat')
    .setVersion('1.0.0')
    // .addTag('cats')
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  // Swagger 엔드포인트 지정 (/docs)
  SwaggerModule.setup('docs', app, document);

  // origin 설정
  app.enableCors({
    // true : 모든 요청 수락, 배포 시 특정 url만 허용할 수 있도록 설정
    origin: true,
    credentials: true,
  });

  const PORT = process.env.PORT;
  await app.listen(PORT);
}
bootstrap();
