import { Injectable, Inject } from '@nestjs/common';

import { Contact } from './models/contact.model';
import { CreateContactDto } from './dtos/create-contact.dto';
import { Connection, Repository } from 'typeorm';
import { User } from '../user/models/user.model';
import { ContactEntity } from './entities/contact.entity';
import { ArrayUtils } from '../../common/utils/ArrayUtils';
import { UnexpectedException } from '../../common/exceptions/unexpected.exception';

@Injectable()
export class ContactService {
    constructor(
        @Inject('ContactRepository')
        private readonly contactRepository: Repository<Contact>,
        @Inject('DatabaseConnection')
        private readonly databaseConnection: Connection
    ) {}

    async findAll(owner: User): Promise<Contact[]> {
        return await this.contactRepository.find({
            where: {
                owner
            }
        });
    }

    async matchContacts(user1: User, user2: User): Promise<Contact[]> {
        const user1Contacts = await this.contactRepository.find({
            where: {
                owner: user1
            }
        });

        const user2Contacts = await this.contactRepository.find({
            where: {
                owner: user2
            }
        });

        const extractPhoneFromContact = (contact: CreateContactDto | Contact): string => {
            return contact.phone;
        };

        return ArrayUtils.matchElementsBetween<Contact>(
            user1Contacts,
            user2Contacts,
            extractPhoneFromContact
        );
    }

    async updateArray(
        owner: User,
        createContactDtoArray: CreateContactDto[],
        deleteIfNotIn: boolean
    ) {
        const contacts = await this.contactRepository.find({
            where: {
                owner
            }
        });
        /**
         * Compares the contacts that are common between the current
         * list of contacts and the contacts saved in the database
         * The result will be the contacts to be updated
         **/
        const phonesContactsUpdate = ArrayUtils.matchElementsBetween<Contact | CreateContactDto>(
            createContactDtoArray,
            contacts,
            ContactService.extractPhoneFromContact
        );
        /**
         * Filter for contacts that are in the current list but not in the database
         * The result will be the contacts to be created(new contacts that User added to the address book)
         */
        const phonesContactsCreate = ArrayUtils.noMatchElementsIn<Contact | CreateContactDto>(
            createContactDtoArray,
            contacts,
            ContactService.extractPhoneFromContact
        );
        /**
         * Filter for contacts that are in the database but not in the current list
         * The result will be the contacts to be deleted(old contacts that User deleted from the address book)
         */
        let phonesContactsDelete = [];
        if (deleteIfNotIn) {
            phonesContactsDelete = ArrayUtils.noMatchElementsIn<Contact | CreateContactDto>(
                contacts,
                createContactDtoArray,
                ContactService.extractPhoneFromContact
            );
        }

        const queryRunner = this.databaseConnection.createQueryRunner();

        try {
            /**
             * You put a checkpoint on the transaction, you are allowing in case of
             * failed transaction, the database will be returned to the initial state
             */
            await queryRunner.connect();
            await queryRunner.startTransaction();

            if (phonesContactsDelete.length > 0) {
                await queryRunner.manager.delete<ContactEntity>(
                    ContactEntity,
                    ContactService.populateContactArray(
                        ContactService.populateContactWithOwnerArray(owner, phonesContactsDelete)
                    )
                );
            }

            if (phonesContactsCreate.length > 0) {
                await queryRunner.manager.save<ContactEntity>(
                    ContactService.populateContactArray(
                        ContactService.populateContactWithOwnerArray(owner, phonesContactsCreate)
                    )
                );
            }
            if (phonesContactsUpdate.length > 0) {
                await queryRunner.manager.save<ContactEntity>(
                    ContactService.populateContactArray(
                        ContactService.populateContactWithOwnerArray(owner, phonesContactsUpdate)
                    )
                );
            }
            await queryRunner.commitTransaction();
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw new UnexpectedException();
        } finally {
            await queryRunner.release();
        }
    }

    private static populateContactWithOwner(owner: User, contact: CreateContactDto): Contact {
        return {
            ...contact,
            owner
        };
    }
    private static populateContactWithOwnerArray(
        owner: User,
        contactArray: CreateContactDto[]
    ): Contact[] {
        return contactArray.map((contactData: CreateContactDto) => {
            return ContactService.populateContactWithOwner(owner, contactData);
        });
    }
    private static populateContactArray(entityDataArray: any): ContactEntity[] {
        return entityDataArray.map((entityData: any) => {
            return new ContactEntity(entityData);
        });
    }

    private static extractPhoneFromContact(contact: CreateContactDto | Contact): string {
        return contact.phone;
    }
}
