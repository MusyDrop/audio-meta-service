import { Injectable } from '@nestjs/common';
import { GetHealthDto } from './get-health.dto.js';

@Injectable()
export class AppService {
  getHealth(): GetHealthDto {
    return {
      ok: 'ok'
    };
  }
}
