import { UserEntity } from './user.entity';
import { Connection } from 'typeorm';

export const userProviders = [
    {
        provide: 'UserRepository',
        useFactory: (connection: Connection) => connection.getRepository(UserEntity),
        inject: ['DatabaseConnection']
    }
];
