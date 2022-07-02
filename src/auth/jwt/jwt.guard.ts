import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// AuthGuard : strategy를 자동으로 실행해주는 특성 가지고 있음 (상속을 통한 구현)
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
