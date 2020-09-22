import { config } from 'dotenv';
import { AppConfig } from './app-config.entity';

function loadEnvironment(): AppConfig {
    if (process.env.NODE_ENV === 'production') {
        config({ path: 'env/production.env' });
    } else if (process.env.NODE_ENV === 'testing') {
        config({ path: 'env/testing.env' });
    } else {
        config({ path: 'env/development.env' });
    }

    return {
        database: {
            type: process.env.dbtype,
            host: process.env.dbhost,
            port: process.env.dbport,
            username: process.env.dbusername,
            password: process.env.dbpassword,
            database: process.env.dbdatabase
        },
        verificationPhone: {
            type: process.env.vftype,
            userId: process.env.vfuserid,
            apiKey: process.env.vfapikey
        }
    };
}

export const configProviders = [
    {
        provide: 'ConfigApp',
        useFactory: async () => {
            return loadEnvironment();
        }
    }
];
