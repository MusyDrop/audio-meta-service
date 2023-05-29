import { Controller } from '@nestjs/common';
import { AudioMetaService } from './audio-meta.service';

@Controller('audio-meta')
export class AudioMetaController {
  constructor(private readonly audioMetaService: AudioMetaService) {}
}
