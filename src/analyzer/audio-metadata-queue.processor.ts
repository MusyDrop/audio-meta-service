import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { BullQueue } from '../bull/bull-queue.enum.js';
import { S3Service } from '../s3/s3.service.js';
import { ExtendedConfigService } from '../config/extended-config.service.js';
import { AudioMetadataDetectionJobPayload } from './interfaces/audio-metadata-detection-job-payload.interface.js';
import { GetAudioMetadataResponseDto } from './dtos/get-audio-metadata-response.dto.js';
import { streamToBuffer } from '../utils/other-utils.js';
import { IAudioMetadata, parseBuffer } from 'music-metadata';
import { AudioMetadataDto } from './dtos/audio-metadata.dto.js';
import { compress } from '../utils/compression.js';
import { createFFmpeg, FFmpeg } from '@ffmpeg/ffmpeg';
import { OnModuleInit } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Processor(BullQueue.AUDIO_METADATA_DETECTION)
export class AudioMetadataQueueProcessor implements OnModuleInit {
  private readonly RAW_DATA_CHUNK_BYTES_OFFSET = 44;
  private readonly ffmpeg: FFmpeg;

  constructor(
    private readonly s3Service: S3Service,
    private readonly config: ExtendedConfigService,
    @InjectPinoLogger(AudioMetadataQueueProcessor.name)
    private readonly logger: PinoLogger
  ) {
    this.ffmpeg = createFFmpeg({ log: true });
  }

  @Process({ concurrency: 1 })
  public async execute(
    job: Job<AudioMetadataDetectionJobPayload>
  ): Promise<GetAudioMetadataResponseDto> {
    const audioStream = await this.s3Service.getObject(
      this.config.get('minio.buckets.audioFilesBucket'),
      job.data.audioFileName
    );

    const audioBuffer = await streamToBuffer(audioStream);

    await this.ffmpeg.FS('writeFile', 'audio.wav', audioBuffer);
    await this.ffmpeg.run(
      '-i',
      'audio.wav',
      '-af',
      'lowpass=f=200',
      'lowpassed.wav'
    );
    const lowPassedAudioBuffer = await this.ffmpeg.FS(
      'readFile',
      'lowpassed.wav'
    );
    const parsedMetadata = await parseBuffer(lowPassedAudioBuffer);
    const metadata = this.stripFormatAndCheck(parsedMetadata);

    const rms = this.calculateRms(
      Buffer.from(lowPassedAudioBuffer),
      metadata,
      job.data.aggregationRate
    );

    // E.g. 167 seconds consist of 5015 keyframes and in order to position keyframes relatively to time
    // we have to increment seconds counter by the duration/keyframesNumber
    const secondsIncrement = metadata.durationSecs / rms.length;
    const offset = secondsIncrement * 0.01; // slight offset shift
    // Seconds fractions or times at which we set the keyframes (rms values)
    const timeCounter = 0;
    // const timestamps = rms.map(() => {
    //   const time = timeCounter;
    //   timeCounter += secondsIncrement - offset;
    //   return time;
    // });

    const compressedRms = await compress(rms);

    return {
      ...metadata,
      compressedRms
    };
  }

  private stripFormatAndCheck(metadata: IAudioMetadata): AudioMetadataDto {
    const format = metadata.format;

    const formattedMetadata: AudioMetadataDto = {
      durationSecs: format.duration,
      bitsPerSample: format.bitsPerSample,
      sampleRate: format.sampleRate,
      numberOfChannels: format.numberOfChannels,
      bitrate: format.bitrate,
      lossless: format.lossless,
      numberOfSamples: format.numberOfSamples,
      codec: format.codec,
      container: format.container
    };

    for (const value of Object.values(formattedMetadata)) {
      if (value === undefined) {
        throw Error('Unable to identify format of an audio file');
      }
    }

    return formattedMetadata;
  }

  /**
   * Calculates RMS by the specified frequency
   * @param buffer
   * @param metadata
   * @param aggregationFrequency
   */
  private calculateRms(
    buffer: Buffer,
    metadata: AudioMetadataDto,
    aggregationFrequency = 30
  ): number[] {
    const rawPcmChunk = buffer.slice(this.RAW_DATA_CHUNK_BYTES_OFFSET);
    const view = Buffer.from(rawPcmChunk);
    // const samples = view.byteLength / meta.format.numberOfChannels / (meta.format.bitsPerSample / 8);

    const bytesPerSample = metadata.bitsPerSample / 8;

    const RmsPerAggregation: number[] = [];
    const audioSamplesPerVideoFrame =
      metadata.sampleRate / aggregationFrequency;
    let squaredSampleValuesSum = 0;

    for (
      let sampleIndex = 0;
      sampleIndex < metadata.numberOfSamples;
      sampleIndex++
    ) {
      let monoValue = 0;

      for (
        let channelIndex = 0;
        channelIndex < metadata.numberOfChannels;
        channelIndex++
      ) {
        // 3 bytes are derived from bits per sample (24 bits === 3 bytes, 16 bits === 2 bytes)
        // It must be >= 0 and <= 1975025ç
        const bytesOffset =
          (sampleIndex * metadata.numberOfChannels + channelIndex) *
          bytesPerSample;

        // Notice: divided by 2 in order to convert it to mono
        monoValue += view.readIntLE(bytesOffset, bytesPerSample) / 2;
        squaredSampleValuesSum += Math.pow(monoValue, 2);
      }

      // Reset frame counter and save RMS each audioSamplesPerVideoFrame sample
      if (sampleIndex % audioSamplesPerVideoFrame === 0) {
        const RMS = Math.sqrt(
          squaredSampleValuesSum / audioSamplesPerVideoFrame
        );
        RmsPerAggregation.push(RMS);
        squaredSampleValuesSum = 0;
      }
    }

    return this.normaliseRms(RmsPerAggregation);
  }

  /**
   * Normalises RMS values in the range suitable for keyframes
   * @param RmsValues array of integers
   */
  private normaliseRms(RmsValues: number[]): number[] {
    const max = Math.max(...RmsValues);
    const min = Math.min(...RmsValues);

    // 100 is a multiplier to move from 0-1 to 0-100
    return RmsValues.map((value) =>
      Math.floor(((value - min) / (max - min)) * 100)
    );
  }

  public async onModuleInit(): Promise<void> {
    await this.ffmpeg.load();
  }
}
