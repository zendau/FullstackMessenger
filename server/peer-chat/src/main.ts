import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { PeerServer } from 'peer';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${process.env.RABBITMQ_LOGIN}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`,
        ],
        queue: 'peer_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  await app.listen();

  PeerServer({
    port: 9000,
    path: '/peer',
    proxied: true,
  });
}
bootstrap();
