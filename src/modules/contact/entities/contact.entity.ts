import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

@Entity()
export class ContactEntity extends BaseEntity {
    @ManyToOne(() => UserEntity, { cascade: true, onDelete: 'CASCADE', primary: true })
    @JoinColumn()
    owner: UserEntity;

    @PrimaryColumn({ length: 50 })
    phone: string;

    @Column({ length: 100 })
    contactName: string;

    constructor(params: { owner: UserEntity; contactName: string; phone: string }) {
        super();
        if (params !== null && params !== undefined) {
            this.owner = params.owner;
            this.contactName = params.contactName;
            this.phone = params.phone;
        }
    }
}
