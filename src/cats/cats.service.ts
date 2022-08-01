import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CatRequestDto } from './dto/cats.request.dto';
import { CatsRepository } from './cats.repository';
import { Cat } from './cats.schema';

@Injectable()
export class CatsService {
  // repository (DB 데이터 처리) 의존성 주입
  constructor(private readonly catsRepository: CatsRepository) {}

  async uploadImg(cat: Cat, files: Express.Multer.File[]) {
    const fileName = `cats/${files[0].filename}`;

    console.log(fileName);
    const newCat = await this.catsRepository.findByIdAndUpdateImg(
      cat.id,
      fileName,
    );
    console.log(newCat);
    return newCat;
  }

  async signUp(body: CatRequestDto) {
    const { email, name, password } = body;
    const isCatExist = await this.catsRepository.existByEmail(email);

    if (isCatExist) {
      // 403 처리, UnauthorizedException: HttpException 필터로 이동
      throw new UnauthorizedException('해당 아이디는 이미 가입 되었습니다');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const cat = await this.catsRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    return cat.readOnlyData;
  }
}
