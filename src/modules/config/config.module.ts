import { Module } from '@nestjs/common';
import { configProviders } from './entities/config.providers';

@Module({
    providers: [...configProviders],
    exports: [...configProviders]
})
export class ConfigModule {}
