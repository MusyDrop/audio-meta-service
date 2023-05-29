import { Controller } from '@nestjs/common';
import { AnalyzerService } from './analyzer.service';

@Controller('audio-meta')
export class AudioMetaController {
  constructor(private readonly audioMetaService: AnalyzerService) {}
}
