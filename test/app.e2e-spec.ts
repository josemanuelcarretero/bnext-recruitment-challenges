import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { NotFoundExceptionFilter } from '../src/common/filters/not-found-exception.filter';
import * as request from 'supertest';

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let server;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule, HttpModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalFilters(new NotFoundExceptionFilter());

        await app.init();
        server = app.getHttpServer();
    });

    afterAll(async () => {
        await server.close();
        await server.disconnect();
        await app.close().then(() => {
            console.log('close');
        });
    });

    it('throws error if URL is invalid', async done => {
        const response = await request(server)
            .get('/')
            .expect(404);

        expect(response.body.error).toEqual('invalid_url');
        expect(response.body.statusCode).toEqual(404);
        done();
    });
});
