import { Catch, ExceptionFilter, ArgumentsHost, NotFoundException } from '@nestjs/common';
import { Response } from 'express';

/**
 * Custom exception filter to convert NotFoundException
 */
@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
    public catch(exception: NotFoundException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        return response.status(404).json({
            statusCode: 404,
            error: 'invalid_url',
            message: 'The route is not a valid URL or the supplied URL is not currently accessible'
        });
    }
}
