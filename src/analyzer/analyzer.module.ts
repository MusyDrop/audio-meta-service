import { Module } from '@nestjs/common';
import { AnalyzerService } from './analyzer.service';
import { AnalyzerController } from './analyzer.controller';
import { BullModule } from '../bull/bull.module';

@Module({
  imports: [BullModule],
  controllers: [AnalyzerController],
  providers: [AnalyzerService]
})
export class AnalyzerModule {}
