import { Module } from '@nestjs/common';
import { ConfigModule } from './modules/config/config.module';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';
import { ContactModule } from './modules/contact/contact.module';
import { PhoneValidationModule } from './modules/phone-validation/phone-validation.module';

@Module({
    imports: [ConfigModule, DatabaseModule, UserModule, ContactModule, PhoneValidationModule],
    controllers: [],
    providers: []
})
export class AppModule {}
