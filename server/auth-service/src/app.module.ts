import { UsersController } from './user/user.controller';
import { Module } from '@nestjs/common';
import { UsersModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from './token/token.module';
import { ConfigModule } from '@nestjs/config';
import { ConfirmModule } from './access/access.module';
import * as Joi from '@hapi/joi';
import config from './ormconfig';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true,
        envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
        validationSchema: Joi.object({
          DATABASE_HOST: Joi.string().required(),
          DATABASE_PORT: Joi.number().required(),
          DATABASE_USER: Joi.string().required(),
          DATABASE_PASSWORD: Joi.string().required(),
          DATABASE_NAME: Joi.string().required(),
          JWT_ACCESS_SECRET: Joi.string().required(),
          JWT_REFRESH_SECRET: Joi.string().required(),
          RABBITMQ_LOGIN: Joi.string().required(),
          RABBITMQ_PASSWORD: Joi.string().required(),
          RABBITMQ_HOST: Joi.string().required(),
          RABBITMQ_PORT: Joi.number().required(),
          BCRYPT_SALT: Joi.number().required(),
          MAILER_HOST: Joi.string().required(),
          MAILER_PORT: Joi.number().required(),
          MAILER_EMAIL: Joi.string().required(),
          MAILER_PASSWORD: Joi.string().required(),
          REDIS_HOST: Joi.string().required(),
          REDIS_PORT: Joi.number().required(),
        })
      }
    ),
    RedisModule.forRoot({
      config: {
        url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      },
    }),
    TypeOrmModule.forRoot(config),
    UsersModule,
    TokenModule,
    ConfirmModule,
    ConfirmModule,
  ],
  controllers: [UsersController],
})
export class AppModule {}
