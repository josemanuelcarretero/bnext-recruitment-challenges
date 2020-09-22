import { createConnection } from 'typeorm';
import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions';
import { AppConfig } from '../config/entities/app-config.entity';

export const databaseProviders = [
    {
        provide: 'DatabaseConnection',
        inject: ['ConfigApp'],
        useFactory: async (config: AppConfig) =>
            await createConnection({
                name: 'default',
                type: config.database.type,
                host: config.database.host,
                port: config.database.port,
                username: config.database.username,
                password: config.database.password,
                database: config.database.database,
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                synchronize: true
            } as ConnectionOptions)
    }
];
