import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { GetHealthDto } from './get-health.dto.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  getHealth(): GetHealthDto {
    return this.appService.getHealth();
  }
}
