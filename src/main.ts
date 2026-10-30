import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001' //chnage with deploy url 
    ],
    credentials: true,
  });
  app.use(express.json({ limit: '10mb' }));
  const port = process.env.PORT ?? 3000;
  await app.listen(port, "0.0.0.0");

  console.log(`Server is Running on PORT: ${port}`);
}

bootstrap();