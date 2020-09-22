import { BadGatewayException } from '@nestjs/common';

export class ExternalPhoneValidationException extends BadGatewayException {
    constructor() {
        super(
            'Phone verification operation could not be completed. Please try again later or contact support',
            'external_phone_verification_error'
        );
    }
}
