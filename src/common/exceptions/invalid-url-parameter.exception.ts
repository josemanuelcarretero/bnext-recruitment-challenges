import { BadRequestException } from '@nestjs/common';

export class InvalidURLParameterException extends BadRequestException {
    constructor(public validationErrorByFields: any) {
        super('There are one or more errors in the url parameters', 'invalid_url_parameter');
    }
}
