import { DatabaseModule } from '../database/database.module';
import { UserService } from './user.service';
import { Module } from '@nestjs/common';
import { userProviders } from './entities/user.providers';
import { UserController } from './user.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [UserController],
    providers: [UserService, ...userProviders],
    exports: [UserService, ...userProviders]
})
export class UserModule {}
