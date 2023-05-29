import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { BullQueue } from '../bull/bull-queue.enum';
import { Queue } from 'bull';

@Injectable()
export class AnalyzerService {
  constructor(
    @InjectQueue(BullQueue.AUDIO_RMS_DETECTION)
    private readonly audioRmsDetectionQueue: Queue
  ) {}
}
