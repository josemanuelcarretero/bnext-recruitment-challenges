import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    firstName: string;

    @Column({ length: 100 })
    lastName: string;

    @Column({ length: 50, unique: true })
    phone: string;

    constructor(params?: { id: number; phone: string; firstName: string; lastName: string }) {
        super();
        if (params !== null && params !== undefined) {
            this.id = params.id;
            this.firstName = params.firstName;
            this.lastName = params.lastName;
            this.phone = params.phone;
        }
    }
}
