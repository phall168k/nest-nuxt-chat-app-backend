import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

  @Get('/healthy-check')
  getHello() {
    return {
      status: 'ok',
    };
  }
}
