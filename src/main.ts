import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/interceptors/exception/http-exception.interceptor';
import { TransformerInterceptor } from './shared/interceptors/transformer/transformer.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // Global exception and transformer interceptors
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformerInterceptor());

  // CORS
  app.enableCors({
    origin: configService.get('FRONTEND_URL', 'http://localhost:3000'),
    credentials: true,
  });

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('UC Talent Backend API')
    .setDescription('UC Talent Backend API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('talents', 'Talent profile endpoints')
    .addTag('jobs', 'Job management endpoints')
    .addTag('organizations', 'Organization endpoints')
    .addTag('locations', 'Location endpoints')
    .addTag('skills', 'Skills and roles endpoints')
    .addTag('payments', 'Payment endpoints')
    .addTag('social', 'Social accounts endpoints')
    .addTag('partners', 'Partner management endpoints')
    .addTag('notifications', 'Notification endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = configService.get('PORT', 3001);
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`🎮 GraphQL Playground: http://localhost:${port}/graphql`);
}

bootstrap();
