import { Module } from '@nestjs/common';
import { BullModule } from '../bull/bull.module.js';
import { S3Module } from '../s3/s3.module.js';
import { ConfigModule } from '../config/config.module.js';
import { AnalyzerController } from './analyzer.controller.js';
import { AnalyzerService } from './analyzer.service.js';
import { AudioMetadataQueueProcessor } from './audio-metadata-queue.processor.js';

@Module({
  imports: [BullModule, S3Module, ConfigModule],
  controllers: [AnalyzerController],
  providers: [AnalyzerService, AudioMetadataQueueProcessor]
})
export class AnalyzerModule {}
