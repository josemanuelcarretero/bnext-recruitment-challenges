import { DatabaseConfig } from './database-config.entity';

export interface AppConfig {
    readonly database: DatabaseConfig;
}
