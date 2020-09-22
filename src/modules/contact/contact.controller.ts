import {
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    Patch,
    Put,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { Contact } from './models/contact.model';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dtos/create-contact.dto';
import { UserService } from '../user/user.service';
import { CustomParseIntPipe } from '../../common/pipes/custom-parse-int-pipe';
import { invalidRequestParameterFactoryPipe } from '../../common/pipes/invalid-request-parameter.factory-pipe';

@Controller('api/v1/users/:id/contacts')
export class ContactController {
    constructor(private contactService: ContactService, private userService: UserService) {}

    @Get()
    @UsePipes(new ValidationPipe({ exceptionFactory: invalidRequestParameterFactoryPipe }))
    async listContacts(@Param('id', new CustomParseIntPipe()) id: number): Promise<Contact[]> {
        const user = await this.userService.findById(id);
        return this.contactService.findAll(user);
    }

    @Put()
    @HttpCode(204)
    @UsePipes(new ValidationPipe({ exceptionFactory: invalidRequestParameterFactoryPipe }))
    async updateContactList(
        @Param('id', new CustomParseIntPipe()) id: number,
        @Body() createContactDtoArray: CreateContactDto[]
    ) {
        const user = await this.userService.findById(id);
        return await this.contactService.updateArray(user, createContactDtoArray, true);
    }

    @Patch()
    @HttpCode(204)
    @UsePipes(new ValidationPipe({ exceptionFactory: invalidRequestParameterFactoryPipe }))
    async updatePartialContactList(
        @Param('id', new CustomParseIntPipe()) id: number,
        @Body() createContactDtoArray: CreateContactDto[]
    ) {
        const user = await this.userService.findById(id);
        return await this.contactService.updateArray(user, createContactDtoArray, false);
    }
}

@Controller('api/v1/users/:id1,:id2/contacts')
export class MatchingContactController {
    constructor(private contactService: ContactService, private userService: UserService) {}

    @Get()
    @UsePipes(new ValidationPipe({ exceptionFactory: invalidRequestParameterFactoryPipe }))
    async listContacts(
        @Param('id1', new CustomParseIntPipe()) id1: number,
        @Param('id2', new CustomParseIntPipe()) id2: number
    ): Promise<Contact[]> {
        const user1 = await this.userService.findById(id1);
        if (id1 !== id2) {
            const user1 = await this.userService.findById(id1);
            const user2 = await this.userService.findById(id2);
            return this.contactService.matchContacts(user1, user2);
        } else {
            return this.contactService.findAll(user1);
        }
    }
}
