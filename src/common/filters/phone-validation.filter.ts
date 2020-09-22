import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { InvalidPhoneException } from '../../modules/phone-validation/exceptions/invalid-phone.exception';
import { InvalidRequestParameterException } from '../exceptions/invalid-request-parameter.exception';
import { ExternalPhoneValidationException } from '../../modules/phone-validation/exceptions/external-phone-validation.exception';

/**
 * Custom exception filter to convert NotFoundException
 */

@Catch(ExternalPhoneValidationException, InvalidPhoneException)
export class PhoneValidationFilter implements ExceptionFilter {
    public catch(exception: InvalidRequestParameterException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        return response.status(exception.getStatus()).json({
            statusCode: exception.getStatus(),
            error: exception.getResponse()['error'],
            message: exception.message
        });
    }
}
