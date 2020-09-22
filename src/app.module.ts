import { Module } from '@nestjs/common';
import { ConfigModule } from './modules/config/config.module';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';
import { ContactModule } from './modules/contact/contact.module';

@Module({
    imports: [ConfigModule, DatabaseModule, UserModule, ContactModule],
    controllers: [],
    providers: []
})
export class AppModule {}
