import { DatabaseConfig } from './database-config.entity';
import { VerificationPhoneConfigEntity } from './verification-phone-config.entity';

export interface AppConfig {
    readonly database: DatabaseConfig;
    readonly verificationPhone: VerificationPhoneConfigEntity;
}
