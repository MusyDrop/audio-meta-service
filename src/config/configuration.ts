// the keys from here in the custom config service
import { JoiAppConfig } from '../utils/joi/joiTypes.js';
import { ServerConfig, serverConfigSchema } from './schemas/server-config.js';
import { RedisConfig, redisConfigSchema } from './schemas/redis-config.js';
import {
  MicroservicesConfig,
  microservicesConfigSchema
} from './schemas/microservices-config.js';
import { MinioConfig, minioConfigSchema } from './schemas/minio-config.js';
import { JoiUtil } from '../utils/joi/JoiUtil.js';
import { SentryConfig, sentryConfigSchema } from './schemas/sentry-config.js';

export interface AppConfig {
  server: ServerConfig;
  redis: RedisConfig;
  microservices: MicroservicesConfig;
  minio: MinioConfig;
  sentry: SentryConfig;
}

export const appSchema = (): JoiAppConfig<AppConfig> => ({
  server: serverConfigSchema(),
  redis: redisConfigSchema(),
  microservices: microservicesConfigSchema(),
  minio: minioConfigSchema(),
  sentry: sentryConfigSchema()
});

export const configuration = (): AppConfig => {
  const schema = appSchema();
  // validate each schema and extract actual values
  return Object.keys(schema).reduce(
    (config, key) => ({
      ...config,
      [key]: JoiUtil.validate(schema[key as keyof AppConfig])
    }),
    {} as AppConfig
  );
};
