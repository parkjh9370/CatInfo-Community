import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';
import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { LoginRequestDto } from 'src/auth/dto/login.request.dto';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { CatsService } from '../cats.service';
import { ReadOnlyCatDto } from '../dto/cat.dto';
import { CatRequestDto } from '../dto/cats.request.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utils/multer.options';
import { Cat } from '../cats.schema';

@Controller('cats')
// 요청 수행 후 보내주는 응답 형태
@UseInterceptors(SuccessInterceptor)
// 에러 처리 형태
@UseFilters(HttpExceptionFilter)
export class CatsController {
  // CatService, AuthService 의존성 주입
  constructor(
    private readonly catsService: CatsService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '현재 고양이 정보 가져오기' })
  // Guard (인증) 사용
  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentCat(@CurrentUser() cat) {
    return cat.readOnlyData;
  }

  @ApiResponse({
    status: 500,
    description: 'Server error...',
  })
  @ApiResponse({
    status: 200,
    description: '성공!',
    type: ReadOnlyCatDto,
  })
  @ApiOperation({ summary: '회원가입' })
  @Post()
  async signUp(@Body() body: CatRequestDto) {
    return await this.catsService.signUp(body);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn(@Body() data: LoginRequestDto) {
    return this.authService.jwtLogin(data);
  }

  // 프론트엔드에서 jwt를 없애면 로그아웃이 되기 때문에 해당 api는 필요가 없다.
  // @ApiOperation({ summary: '로그아웃' })
  // @Post('logout')
  // logOut() {
  // return 'logout';
  // }

  @ApiOperation({ summary: '고양이 이미지 업로드' })
  // 프론트에서 전송해주는 키 이름으로 인자 설정,
  // 사진 업로드 갯수 제한
  // 파일 업로드 조건(upload/cats 라는 폴더에 사진 파일 저장)
  @UseInterceptors(FilesInterceptor('image', 10, multerOptions('cats')))
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  uploadCatImg(
    @UploadedFiles() files: Array<Express.Multer.File>,
    // 현재 유저 가져오기
    @CurrentUser() cat: Cat,
  ) {
    // console.log(files);
    // return { image: `http://localhost:8000/media/cats/${files[0].filename}` };
    return this.catsService.uploadImg(cat, files);
  }

  @ApiOperation({ summary: '모든 고양이 가져오기' })
  @Get('all')
  getAllCat() {
    return this.catsService.getAllCat();
  }
}

/**
 getOneCat(@Param('id', ParseIntPipe) param: number) {
  console.log(param);
  return 'one cat';
}
// PiPe: 클라이언트 요청에서 들어오는 데이터의 유효성 검사 및 변환을 실행해
  // 서버가 원하는 데이터를 얻얼 수 있도록 도와주는 클래스
  // param의 키 값을 id 로 받고, 이를 number 타입으로 변환
  // + 키 값 id 아닐 시 validation error
 */
