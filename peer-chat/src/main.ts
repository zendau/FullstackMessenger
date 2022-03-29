import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { PeerServer } from 'peer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  });

  PeerServer({ port: 9000, path: '/peer' });
  await app.listen(3000);
}
bootstrap();
