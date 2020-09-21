import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { NotFoundExceptionFilter } from '../src/common/filters/not-found-exception.filter';
import * as request from 'supertest';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule, HttpModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalFilters(new NotFoundExceptionFilter());

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('throws error if URL is invalid', async done => {
        const response = await request(app.getHttpServer())
            .get('/')
            .expect(404);

        expect(response.body.error).toEqual('invalid_url');
        expect(response.body.statusCode).toEqual(404);
        done();
    });
});
