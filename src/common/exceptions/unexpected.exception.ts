import { BadGatewayException } from '@nestjs/common';

export class UnexpectedException extends BadGatewayException {
    constructor() {
        super(
            'There has been some mistake in this operation. Please try again later or contact support',
            'unexpected_error'
        );
    }
}
