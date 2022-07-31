import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // class-validation 사용 등록
  app.useGlobalFilters(new HttpExceptionFilter());

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

  app.enableCors({
    // true : 모든 요청 수락, 배포 시 특정 url만 허용할 수 있도록 설정
    origin: true,
    credentials: true,
  });
  const PORT = process.env.PORT;
  await app.listen(PORT);
}
bootstrap();
