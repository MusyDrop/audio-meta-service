import { Module } from '@nestjs/common';
import { BullModule as RootBullModule } from '@nestjs/bull';
import { ConfigModule } from '../config/config.module.js';
import { ExtendedConfigService } from '../config/extended-config.service.js';
import { BullQueue } from './bull-queue.enum.js';
import { BullService } from './bull.service.js';

@Module({
  imports: [
    RootBullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ExtendedConfigService],
      useFactory: async (config: ExtendedConfigService) => ({
        redis: {
          host: config.get('redis.host'),
          port: config.get('redis.port')
        },
        prefix: 'audio-meta'
      })
    }),

    // Iterate over queues and register them
    ...Object.values(BullQueue).map((value) =>
      RootBullModule.registerQueue({ name: value })
    )
  ],
  providers: [BullService],
  exports: [RootBullModule]
})
export class BullModule {}
