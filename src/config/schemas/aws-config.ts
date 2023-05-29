import Joi from 'joi';
import { JoiConfig } from '../types';

export interface AwsConfig {
  region?: string;
  profile?: string;
  s3UploadsBucket?: string;
}

export const awsConfigSchema = (): JoiConfig<AwsConfig> => ({
  region: {
    value: process.env.AWS_REGION as string,
    schema: Joi.string().optional()
  },
  profile: {
    value: process.env.AWS_PROFILE as string | undefined,
    schema: Joi.string().optional()
  },
  s3UploadsBucket: {
    value: process.env.AWS_S3_UPLOADS_BUCKET as string,
    schema: Joi.string().optional()
  }
});
