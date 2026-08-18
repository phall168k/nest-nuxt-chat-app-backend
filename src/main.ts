import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe, VersioningType } from '@nestjs/common';
import { formatValidationErrors } from './common/utils/validation-error.util';
import { setupSwagger } from './swagger';
import { HttpResponseInterceptor } from './common/http/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix(`${process.env.API_PREFIX}`);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (validationErrors) => {
        return new BadRequestException({
          success: false,
          statusCode: 400,
          message: 'Validation failed',
          errors: formatValidationErrors(validationErrors),
        });
      },
    }),
  );
  setupSwagger(app);
  app.useGlobalInterceptors(new HttpResponseInterceptor());
  await app.listen(process.env.API_PORT ?? 8000);
}
bootstrap();
