import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetAudioMetadataQueryDto {
  /**
   * Audio file name in the S3 storage
   */
  @IsString()
  @IsNotEmpty()
  audioFileName: string;

  /**
   * Basically a video frame rate
   */
  @Type(() => Number)
  @IsInt()
  aggregationRate: number;
}
