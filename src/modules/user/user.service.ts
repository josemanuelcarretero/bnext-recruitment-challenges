import { Injectable, Inject } from '@nestjs/common';

import { User } from './models/user.model';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { UserAlreadyExistsException } from './exceptions/user-already-exists.exception';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @Inject('UserRepository')
        private readonly userRepository: Repository<User>
    ) {}

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async findById(userID: number): Promise<User> {
        const user = await this.userRepository.findOne(userID);
        if (!user) {
            throw new UserNotFoundException(userID);
        }
        return user;
    }

    async create({ firstName, lastName, phone }: CreateUserDto): Promise<User> {
        try {
            const insertResult = await this.userRepository.insert({ firstName, lastName, phone });
            return {
                id: insertResult.identifiers[0].id,
                firstName,
                lastName,
                phone
            };
        } catch (e) {
            throw new UserAlreadyExistsException(phone);
        }
    }
}
