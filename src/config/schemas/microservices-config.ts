import { JoiConfig } from '../../utils/joi/joiTypes.js';

export interface MicroservicesConfig {}

export const microservicesConfigSchema =
  (): JoiConfig<MicroservicesConfig> => ({});
