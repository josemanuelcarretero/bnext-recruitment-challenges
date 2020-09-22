import { ContactEntity } from './contact.entity';
import { Connection } from 'typeorm';

export const contactProviders = [
    {
        provide: 'ContactRepository',
        useFactory: (connection: Connection) => connection.getRepository(ContactEntity),
        inject: ['DatabaseConnection']
    }
];
