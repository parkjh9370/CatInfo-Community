import { Controller, Get, Req, Body, Param } from '@nestjs/common';
// import { Request } from 'express';
import { AppService } from './app.service';
// import { CatsService } from './cats/cats.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }
}

/**
 * 의존성 주입
 * AppController : 소비자
 * AppService: 제품
 * 제품을 소비자가 사용하고 있음
 * Provider: 공급자
 */
