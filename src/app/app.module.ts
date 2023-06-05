import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module.js';
import { ConfigModule } from '../config/config.module.js';
import { BullModule } from '../bull/bull.module.js';
import { AnalyzerModule } from '../analyzer/analyzer.module.js';
import { S3Module } from '../s3/s3.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRoot(),
    BullModule,
    AnalyzerModule,
    S3Module
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
