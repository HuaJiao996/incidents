import { NestFactory } from '@nestjs/core';
import { ServerModule } from './server.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '@app/common/filters/http-exception.filter';
import { LoggingInterceptor } from '@app/common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    ServerModule,
    new FastifyAdapter(),
    {
      logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    },
  );
  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('API')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch(console.error);
