import { Module } from '@nestjs/common';
import { ConfigModule } from './modules/config/config.module';
import { DatabaseModule } from './modules/database/database.module';

@Module({
    imports: [ConfigModule, DatabaseModule],
    controllers: [],
    providers: []
})
export class AppModule {}
