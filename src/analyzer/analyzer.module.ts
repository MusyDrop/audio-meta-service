import { Module } from '@nestjs/common';
import { AnalyzerService } from './analyzer.service';
import { AudioMetaController } from './analyzer.controller';

@Module({
  controllers: [AudioMetaController],
  providers: [AnalyzerService]
})
export class AnalyzerModule {}
