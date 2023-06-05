import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module.js';
import { S3Service } from './s3.service.js';

@Module({
  imports: [ConfigModule],
  providers: [S3Service],
  exports: [S3Service]
})
export class S3Module {}
