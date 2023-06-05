import { Controller, Get, Query } from '@nestjs/common';
import { AnalyzerService } from './analyzer.service.js';
import { GetAudioMetadataQueryDto } from './dtos/get-audio-metadata-query.dto.js';
import { GetAudioMetadataResponseDto } from './dtos/get-audio-metadata-response.dto.js';

@Controller('analyzer')
export class AnalyzerController {
  constructor(private readonly analyzerService: AnalyzerService) {}

  @Get('/metadata')
  public async getMetadata(
    @Query() body: GetAudioMetadataQueryDto
  ): Promise<GetAudioMetadataResponseDto> {
    return await this.analyzerService.getAudioMetadata(
      body.audioFileName,
      body.aggregationRate
    );
  }
}
