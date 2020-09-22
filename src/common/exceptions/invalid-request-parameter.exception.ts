import { BadRequestException } from '@nestjs/common';

export class InvalidRequestParameterException extends BadRequestException {
    constructor(public validationErrorByFields: any) {
        super('There are one or more errors in the input request data', 'invalid_request_data');
    }
}
