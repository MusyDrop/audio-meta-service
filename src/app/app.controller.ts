import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { GetHealthDto } from './get-health.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHealth(): GetHealthDto {
    return this.appService.getHealth();
  }
}
