import { Controller, Get, Query } from '@nestjs/common';
import { AnalyzerService } from './analyzer.service';
import { GetAudioMetadataQueryDto } from './dtos/get-audio-metadata-query.dto';
import { GetAudioMetadataResponseDto } from './dtos/get-audio-metadata-response.dto';

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
