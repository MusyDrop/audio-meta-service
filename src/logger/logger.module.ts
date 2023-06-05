import { DynamicModule, Module } from '@nestjs/common';
import { LoggerModule as RootLoggerModule } from 'nestjs-pino';
import { ConfigModule } from '../config/config.module.js';
import { ExtendedConfigService } from '../config/extended-config.service.js';
import { getLoggerParams } from './get-logger-params.js';

// TODO: Move to generic lib
@Module({})
export class LoggerModule {
  // I have no idea why it works, but we use Dynamic Module here
  // to overcome unresolved dependency issue in global providers such as interceptor/guard etc.
  public static forRoot(): DynamicModule {
    return {
      module: LoggerModule,
      imports: [
        RootLoggerModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ExtendedConfigService],
          useFactory: async (configService: ExtendedConfigService) => {
            return getLoggerParams(configService.get('server.loggerLevel'));
          }
        })
      ]
    };
  }
}
