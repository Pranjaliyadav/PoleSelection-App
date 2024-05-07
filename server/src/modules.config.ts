//way to use redisModule defined in redis.module.ts file

import { Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from './redis.module';

//registerAsync we alreay defined in redis module
export const redisModule = RedisModule.registerAsync({
  imports: [ConfigModule], //using this, as we are using ConfigService to fetch environment variables

  //redis connection optiosn are fetched from ConfigService 
  useFactory: async (configService: ConfigService) => {
    const logger = new Logger('RedisModule');

    return {
      connectionOptions: {
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
      },
      onClientReady: (client) => {
        logger.log('Redis client ready');

        client.on('error', (err) => {
          logger.error('Redis Client Error: ', err);
        });

        client.on('connect', () => {
          logger.log(
            `Connected to redis on ${client.options.host}:${client.options.port}`,
          );
        });
      },
    };
  },
  inject: [ConfigService], //array of token respresnting dependecies that should be injected into the useFactory fn. 
});