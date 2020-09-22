import { User } from '../../user/models/user.model';

export interface Contact {
    owner: User;
    contactName: string;
    phone: string;
}
