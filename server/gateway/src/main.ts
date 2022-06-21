import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('NestJS Messager')
    .setDescription('The NestJS Messager API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  });

  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();
