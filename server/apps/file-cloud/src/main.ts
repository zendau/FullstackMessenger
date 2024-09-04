import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AppModule,
  //   {
  //     transport: Transport.RMQ,
  //     options: {
  //       urls: [
  //         `amqp://${process.env.RABBITMQ_LOGIN}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`,
  //       ],
  //       queue: 'file_queue',
  //       queueOptions: {
  //         durable: false,
  //       },
  //     },
  //   },
  // );
  // await app.listen();
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqp://${process.env.RABBITMQ_LOGIN}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`,
      ],
      queue: 'file_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  app.enableCors({
    //origin: process.env.CLIENT_ORIGIN,
    origin: 'http://localhost:5173',
    methods: ['GET', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  });

  await app.startAllMicroservices();
  await app.listen(4000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
