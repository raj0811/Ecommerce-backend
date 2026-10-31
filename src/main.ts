
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    bodyParser: true,
  });

  app.enableCors({
    origin: [
      'https://ecommerce-frontend-umber-alpha.vercel.app',
      'http://localhost:3000',
    ],
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Guest-Id',
      'Idempotency-Key',
    ],
    credentials: true,
    optionsSuccessStatus: 204,
  });

  const port = process.env.PORT ?? 3000;

  await app.listen(port, '0.0.0.0');

  console.log(`Server is Running on PORT: ${port}`);
}

bootstrap();
