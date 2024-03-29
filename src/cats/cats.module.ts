import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from 'src/auth/auth.module';
import { CatsController } from './controllers/cats.controller';
import { CatsRepository } from './cats.repository';
import { Cat, CatSchema } from './cats.schema';
import { CatsService } from './cats.service';

@Module({
  imports: [
    MulterModule.register({
      // 폴더 저장 위치
      dest: './upload',
    }),

    MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]),

    // 순환 모듈 참조 : 서로의 모듈을 참조할 시 해당 방법을 통해 해결
    forwardRef(() => AuthModule),
  ],
  controllers: [CatsController],
  providers: [CatsService, CatsRepository],
  exports: [CatsService, CatsRepository],
})
export class CatsModule {}
