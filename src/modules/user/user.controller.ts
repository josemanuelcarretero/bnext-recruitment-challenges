import {
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    Post,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';

import { User } from './models/user.model';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { invalidRequestParameterFactoryPipe } from '../../common/pipes/invalid-request-parameter.factory-pipe';
import { CustomParseIntPipe } from '../../common/pipes/custom-parse-int-pipe';
import { PhoneValidationService } from '../phone-validation/phone-validation.service';

@Controller('api/v1/users')
export class UserController {
    constructor(
        private userService: UserService,
        private phoneVerificationService: PhoneValidationService
    ) {}

    @Get()
    async listUsers(): Promise<User[]> {
        return await this.userService.findAll();
    }

    @Post()
    @HttpCode(201)
    @UsePipes(new ValidationPipe({ exceptionFactory: invalidRequestParameterFactoryPipe }))
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        const verifiedPhone = await this.phoneVerificationService.verifyPhone(createUserDto.phone);
        return await this.userService.create({
            ...createUserDto,
            phone: verifiedPhone
        });
    }

    @Get(':id')
    findById(@Param('id', new CustomParseIntPipe()) id: number): Promise<User> {
        return this.userService.findById(id);
    }
}
