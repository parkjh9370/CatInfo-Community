import { forwardRef, Module } from '@nestjs/common';
import { CatsModule } from 'src/cats/cats.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    // 인증
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    // 토근 발급(등록) 시 조건
    JwtModule.register({
      secret: 'my-scret-key',
      signOptions: { expiresIn: '1y' },
    }),
    // 순환 모듈 참조 문제 해결
    forwardRef(() => CatsModule),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
