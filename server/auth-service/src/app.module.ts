import { RoleController } from './role/role.controller';
import { UsersController } from './user/user.controller';
import { Module } from '@nestjs/common';
import { UsersModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from './token/token.module';
import { ConfigModule } from '@nestjs/config';
import { RoleModule } from './role/role.module';
import { ConfirmModule } from './access/access.module';
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    UsersModule,
    TokenModule,
    ConfirmModule,
    ConfigModule.forRoot(
      {
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
          BASE_USER_ROLE_ID: Joi.number().required(),
          NODEMAILER_HOST: Joi.string().required(),
          NODEMAILER_PORT: Joi.number().required(),
          NODEMAILER_EMAIL: Joi.string().required(),
          NODEMAILER_PASSWORD: Joi.string().required(),
          REDIS_HOST: Joi.string().required(),
          REDIS_PORT: Joi.number().required(),
        })
      }
    ),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    RoleModule,
    ConfirmModule,
  ],
  controllers: [UsersController, RoleController]
})
export class AppModule {}
