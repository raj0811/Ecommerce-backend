import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001' //chnage with deploy url 
    ],
    credentials: true,
  });

  const port = process.env.PORT ?? 3000;

  await app.listen(port);

  console.log(`Server is Running on PORT: ${port}`);
}

bootstrap();