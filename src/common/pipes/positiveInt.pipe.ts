import { HttpException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PositiveIntPipe implements PipeTransform {
  transform(value: number) {
    // console.log(value);
    if (value < 0) {
      throw new HttpException('Value should be bigger than 0', 400);
    }
    return value;
  }
}
