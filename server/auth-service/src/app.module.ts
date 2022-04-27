import { RoleController } from './role/role.controller';
import { UsersController } from './user/users.controller';
import { Module } from '@nestjs/common';
import { UsersModule } from './user/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from './token/token.module';
import { ConfigModule } from '@nestjs/config';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    UsersModule,
    TokenModule,
    ConfigModule.forRoot(),
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
  ],
  controllers: [UsersController, RoleController],
})
export class AppModule {}
