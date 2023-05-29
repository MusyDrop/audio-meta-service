import { Module } from '@nestjs/common';
import { AudioMetaService } from './audio-meta.service';
import { AudioMetaController } from './audio-meta.controller';

@Module({
  controllers: [AudioMetaController],
  providers: [AudioMetaService]
})
export class AudioMetaModule {}
