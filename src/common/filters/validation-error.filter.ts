import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { InvalidRequestParameterException } from '../exceptions/invalid-request-parameter.exception';
import { InvalidURLParameterException } from '../exceptions/invalid-url-parameter.exception';

/**
 * Custom exception filter to convert NotFoundException
 */

@Catch(InvalidRequestParameterException, InvalidURLParameterException)
export class ValidationErrorFilter implements ExceptionFilter {
    public catch(exception: InvalidRequestParameterException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        return response.status(exception.getStatus()).json({
            statusCode: exception.getStatus(),
            error: exception.getResponse()['error'],
            message: exception.message,
            fixList: exception.validationErrorByFields
        });
    }
}
