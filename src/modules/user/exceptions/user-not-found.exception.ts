import { BadRequestException } from '@nestjs/common';

export class UserNotFoundException extends BadRequestException {
    constructor(userID: number) {
        super(`User ${userID} not found`, 'user_not_found');
    }
}
