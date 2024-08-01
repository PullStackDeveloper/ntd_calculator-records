import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AuthInterceptor } from './common/interceptors/auth.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const httpService = app.get(HttpService);
  app.setGlobalPrefix('api');
  app.enableVersioning();
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  const configService = app.get(ConfigService);
  app.useGlobalInterceptors(new AuthInterceptor(httpService, configService));
  await app.listen(5000);
}
bootstrap();
