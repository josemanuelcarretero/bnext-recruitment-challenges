import { ConflictException } from '@nestjs/common';

export class UserAlreadyExistsException extends ConflictException {
    constructor(phone: string) {
        super(`User ${phone} already exists`, 'user_already_exits');
    }
}
