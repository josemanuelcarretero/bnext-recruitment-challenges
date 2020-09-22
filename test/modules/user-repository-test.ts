import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export class UserRepositoryTest {
    constructor(private app: INestApplication) {}

    checkUser(userData1, userData2) {
        expect(userData1.firstName).toEqual(userData2.firstName);
        expect(userData1.lastName).toEqual(userData2.lastName);
        expect(userData1.phone).toEqual(userData2.phone);
    }

    async createValidUser(userData) {
        const { body } = await request(this.app.getHttpServer())
            .post('/api/v1/users')
            .send(userData)
            .expect(201);
        this.checkUser(body, userData);
        return body;
    }

    async getListUser() {
        const { body } = await request(this.app.getHttpServer())
            .get('/api/v1/users')
            .expect(200);
        expect(body.constructor).toEqual(Array);
        return body;
    }

    async getValidUser(userData) {
        const { body } = await request(this.app.getHttpServer())
            .get(`/api/v1/users/${userData.id}`)
            .send(userData)
            .expect(200);

        this.checkUser(body, userData);
        return body;
    }
    async createInvalidUser(userData, fixListObject) {
        const { body } = await request(this.app.getHttpServer())
            .post('/api/v1/users')
            .send(userData)
            .expect(400);

        expect(body.statusCode).toEqual(400);
        expect(body.error).toEqual('invalid_request_data');
        expect(body.fixList.firstName).toEqual(fixListObject.firstName);
        expect(body.fixList.lastName).toEqual(fixListObject.lastName);
        expect(body.fixList.phone).toEqual(fixListObject.phone);
    }
}
