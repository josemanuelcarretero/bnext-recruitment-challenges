import { DatabaseModule } from '../database/database.module';
import { ContactService } from './contact.service';
import { Module } from '@nestjs/common';
import { contactProviders } from './entities/contact.provider';
import { ContactController, MatchingContactController } from './contact.controller';
import { UserModule } from '../user/user.module';

@Module({
    imports: [DatabaseModule, UserModule],
    controllers: [MatchingContactController, ContactController],
    providers: [MatchingContactController, ContactService, ...contactProviders]
})
export class ContactModule {}
