import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export class ContactRepositoryTest {
    constructor(private app: INestApplication) {}

    async getContactList(user) {
        const { body } = await request(this.app.getHttpServer())
            .get(`/api/v1/users/${user.id}/contacts`)
            .expect(200);
        expect(body.constructor).toEqual(Array);
        return body;
    }

    async getMatchingContactList(user1, user2) {
        const { body } = await request(this.app.getHttpServer())
            .get(`/api/v1/users/${user1.id},${user2.id}/contacts`)
            .expect(200);
        expect(body.constructor).toEqual(Array);
        return body;
    }

    async updateContactList(user, contactList) {
        await request(this.app.getHttpServer())
            .put(`/api/v1/users/${user.id}/contacts`)
            .send(contactList)
            .expect(204);
    }

    async updatePartialContactList(user, contactList) {
        await request(this.app.getHttpServer())
            .patch(`/api/v1/users/${user.id}/contacts`)
            .send(contactList)
            .expect(204);
    }
}
