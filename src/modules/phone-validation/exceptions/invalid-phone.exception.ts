import { BadRequestException } from '@nestjs/common';

export class InvalidPhoneException extends BadRequestException {
    constructor() {
        super(`Phone format is not valid`, 'invalid_phone_number');
    }
}
