import { 
  Controller, 
  Post, 
  Body 
} from '@nestjs/common';

@Controller()
export class AppController {
  @Post('/')
  receiveHello(@Body() data: any): string {
    return 'Hello!';
  }
}


