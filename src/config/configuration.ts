import { JoiAppConfig } from './types';
import { JoiUtil } from '../utils/joi/JoiUtil';
import { ServerConfig, serverConfigSchema } from './schemas/server-config';
import { RedisConfig, redisConfigSchema } from './schemas/redis-config';
import {
  MicroservicesConfig,
  microservicesConfigSchema,
} from './schemas/microservices-config';
import { AwsConfig, awsConfigSchema } from './schemas/aws-config';

// the keys from here in the custom config service
export interface AppConfig {
  server: ServerConfig;
  redis: RedisConfig;
  microservices: MicroservicesConfig;
  aws: AwsConfig;
}

export const appSchema = (): JoiAppConfig<AppConfig> => ({
  server: serverConfigSchema(),
  redis: redisConfigSchema(),
  microservices: microservicesConfigSchema(),
  aws: awsConfigSchema(),
});

export const configuration = (): AppConfig => {
  const schema = appSchema();
  // validate each schema and extract actual values
  return Object.keys(schema).reduce(
    (config, key) => ({
      ...config,
      [key]: JoiUtil.validate(schema[key as keyof AppConfig]),
    }),
    {} as AppConfig,
  );
};
