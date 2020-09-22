import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NotFoundExceptionFilter } from './common/filters/not-found-exception.filter';
import { ValidationErrorFilter } from './common/filters/validation-error.filter';
import { PhoneValidationFilter } from './common/filters/phone-validation.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalFilters(new NotFoundExceptionFilter());
    app.useGlobalFilters(new ValidationErrorFilter());
    app.useGlobalFilters(new PhoneValidationFilter());
    await app.listen(3000);
}
bootstrap();
