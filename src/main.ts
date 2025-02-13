import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BigIntInterceptor } from './interceptors/bigIntInterceptor';
import { IoAdapter } from '@nestjs/platform-socket.io'; // ✅ Import IoAdapter

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // ✅ Set WebSocket Adapter
  app.useWebSocketAdapter(new IoAdapter(app));

  // Set global prefix for all routes
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('Wallet App API')
    .setDescription('API documentation for Wallet App')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalInterceptors(new BigIntInterceptor());
  await app.listen(3000);
}
bootstrap();
