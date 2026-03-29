import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // buang field yang ga dikenal
      forbidNonWhitelisted: true, // error kalau ada field aneh
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
