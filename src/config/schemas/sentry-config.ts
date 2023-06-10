import Joi from 'joi';
import { JoiConfig } from '../../utils/joi/joiTypes.js';

export interface SentryConfig {
  dsn: string;
  debug: boolean;
}

export const sentryConfigSchema = (): JoiConfig<SentryConfig> => ({
  dsn: {
    value: process.env.SENTRY_DSN as string,
    schema: Joi.string().required()
  },
  debug: {
    value: (process.env.SENTRY_DEBUG as string) === 'true',
    schema: Joi.boolean().required()
  }
});
