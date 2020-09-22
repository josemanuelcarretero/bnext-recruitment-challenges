import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { ConfigModule } from '../config/config.module';
import { DatabaseService } from './database.service';

@Module({
    imports: [ConfigModule],
    providers: [DatabaseService, ...databaseProviders],
    exports: [DatabaseService, ...databaseProviders]
})
export class DatabaseModule {}
