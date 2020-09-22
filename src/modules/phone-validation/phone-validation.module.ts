import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { PhoneValidationService } from './phone-validation.service';

@Module({
    imports: [HttpModule, ConfigModule],
    providers: [PhoneValidationService],
    exports: [PhoneValidationService]
})
export class PhoneValidationModule {}
