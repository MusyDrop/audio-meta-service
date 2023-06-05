import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { BullQueue } from '../bull/bull-queue.enum.js';
import { AudioMetadataDetectionJobPayload } from './interfaces/audio-metadata-detection-job-payload.interface.js';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { GetAudioMetadataResponseDto } from './dtos/get-audio-metadata-response.dto.js';

@Injectable()
export class AnalyzerService {
  constructor(
    @InjectQueue(BullQueue.AUDIO_METADATA_DETECTION)
    private readonly audioMetadataDetection: Queue<AudioMetadataDetectionJobPayload>,
    @InjectPinoLogger(AnalyzerService.name) private readonly logger: PinoLogger
  ) {}

  /**
   * Accepts an audio file name from S3 bucket
   * @param audioFileName
   * @param aggregationRate
   */
  public async getAudioMetadata(
    audioFileName: string,
    aggregationRate: number
  ): Promise<GetAudioMetadataResponseDto> {
    const job = await this.audioMetadataDetection.add({
      audioFileName,
      aggregationRate
    });

    try {
      return await job.finished();
    } catch (e) {
      this.logger.error(`Unable to analyze provided audio file, error: ${e}`);
      throw new BadRequestException('Unable to analyze provided audio file');
    }
  }
}
