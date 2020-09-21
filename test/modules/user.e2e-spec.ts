import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { NotFoundExceptionFilter } from '../../src/common/filters/not-found-exception.filter';
import * as request from 'supertest';

describe('User Module (e2e)', () => {
    let app: INestApplication;

    const generatorFixList = (field: string, maxSize = '100') => {
        return [
            `${field} must be a string`,
            `${field} must be shorter than or equal to ${maxSize} characters`,
            `${field} must be longer than or equal to 2 characters`
        ];
    };

    const validUserDataList = [
        {
            firstName: 'Jose',
            lastName: 'Fernandez',
            phone: '+34667998721'
        },
        {
            firstName: 'Manuel',
            lastName: 'Orenes',
            phone: '+34667998722'
        },
        {
            firstName: 'Joaquin',
            lastName: 'Ortega',
            phone: '+34667998723'
        }
    ];

    const invalidUserDataList = [
        {
            lastName: 'Fernandez',
            phone: '+34667998721'
        },
        {
            firstName: 'Jose',
            phone: '+34667998721'
        },
        {
            firstName: 'Jose',
            lastName: 'Fernandez'
        },
        {
            firstName: 'J',
            lastName: 'Orenes',
            phone: '+34667998721'
        },
        {
            firstName: new Array(102).join('A'),
            lastName: 'Orenes',
            phone: '+34667998721'
        },
        {
            firstName: 'Jose',
            lastName: 'Fernandez',
            phone: 'NotIsANumber'
        }
    ];

    const checkUser = (userData1, userData2) => {
        expect(userData1.firstName).toEqual(userData2.firstName);
        expect(userData1.lastName).toEqual(userData2.lastName);
        expect(userData1.phone).toEqual(userData2.phone);
    };

    const createValidUser = async userData => {
        const { body } = await request(app.getHttpServer())
            .post('/api/v1/users')
            .send(userData)
            .expect(201);
        checkUser(body, userData);
        return body;
    };
    const getValidUser = async userData => {
        const { body } = await request(app.getHttpServer())
            .get(`/api/v1/users/${userData.id}`)
            .send(userData)
            .expect(200);

        checkUser(body, userData);
        return body;
    };

    const createInvalidUser = async (userData, fixListObject) => {
        const { body } = await request(app.getHttpServer())
            .post('/api/v1/users')
            .send(userData)
            .expect(400);

        expect(body.statusCode).toEqual(400);
        expect(body.error).toEqual('invalid_request_data');
        expect(body.fixList.firstName).toEqual(fixListObject.firstName);
        expect(body.fixList.lastName).toEqual(fixListObject.lastName);
        expect(body.fixList.phone).toEqual(fixListObject.phone);
    };
    const getListUser = async () => {
        const { body } = await request(app.getHttpServer())
            .get('/api/v1/users')
            .expect(200);
        expect(body.constructor).toEqual(Array);
        return body;
    };

    beforeAll(async () => {
        process.env.NODE_ENV = 'testing';

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

    it('(GET /api/v1/users) Get an empty user list', async done => {
        const userList = await getListUser();

        expect(userList.length).toEqual(0);

        done();
    });

    it('(POST /api/v1/users) Create two valid users', async done => {
        await createValidUser(validUserDataList[0]);
        await createValidUser(validUserDataList[1]);
        done();
    });

    it('(GET /api/v1/users) Get an user list with 2 user', async done => {
        const userList = await getListUser();

        expect(userList.length).toEqual(2);

        checkUser(userList[0], validUserDataList[0]);
        checkUser(userList[1], validUserDataList[1]);

        expect(userList[0].id).not.toEqual(undefined);
        expect(userList[0].id).not.toEqual(undefined);
        expect(userList[1].id).toBeGreaterThan(userList[0].id);

        done();
    });

    it('(POST /api/v1/users) Throws error if you try to create an existing user', async done => {
        const { body } = await request(app.getHttpServer())
            .post('/api/v1/users')
            .send(validUserDataList[0])
            .expect(409);

        expect(body.statusCode).toEqual(409);
        expect(body.error).toEqual('user_already_exits');
        done();
    });

    it('(POST /api/v1/users) Throws error if you try to create an user with invalid data (without firstName)', async done => {
        await createInvalidUser(invalidUserDataList[0], {
            firstName: generatorFixList('firstName')
        });
        done();
    });

    it('(POST /api/v1/users) Throws error if you try to create an user with invalid data(without lastName)', async done => {
        await createInvalidUser(invalidUserDataList[1], { lastName: generatorFixList('lastName') });
        done();
    });

    it('(POST /api/v1/users) Throws error if you try to create an user with invalid data(without phone)', async done => {
        await createInvalidUser(invalidUserDataList[2], { phone: generatorFixList('phone', '50') });

        done();
    });

    it('(POST /api/v1/users) Throws error if you try to create an user with invalid data(firstName too short)', async done => {
        await createInvalidUser(invalidUserDataList[3], {
            firstName: [generatorFixList('firstName')[2]]
        });

        done();
    });
    it('(POST /api/v1/users) Throws error if you try to create an user with invalid data(firstName too long)', async done => {
        await createInvalidUser(invalidUserDataList[4], {
            firstName: [generatorFixList('firstName')[1]]
        });

        done();
    });

    it('(POST /api/v1/users) Throws error if you try to create an user with invalid phone(external service)', async done => {
        await createInvalidUser(invalidUserDataList[5], {
            phone: [`phone format is invalid`]
        });
        done();
    });

    it('(POST /api/v1/users) Throws error if you try to create an user with invalid data(with nothing)', async done => {
        await createInvalidUser(
            {},
            {
                firstName: generatorFixList('firstName'),
                lastName: generatorFixList('lastName'),
                phone: generatorFixList('phone', '50')
            }
        );

        done();
    });

    it('(GET /api/v1/users/:id) Get an registered user', async done => {
        const createdUser = await createValidUser(validUserDataList[2]);
        const registeredUser = await getValidUser(createdUser);

        expect(createdUser.id).toEqual(registeredUser.id);

        done();
    });

    it('(GET /api/v1/users/:id) throws error if id does not match to a registered user', async done => {
        const response = await request(app.getHttpServer())
            .get('/api/v1/users/9999999')
            .expect(400);

        expect(response.body.error).toEqual('user_not_found');
        expect(response.body.statusCode).toEqual(400);
        done();
    });

    it('(GET /api/v1/users/:id) throws error if id is not a number', async done => {
        const response = await request(app.getHttpServer())
            .get('/api/v1/users/isNotAId')
            .expect(400);

        expect(response.body.error).toEqual('invalid_url_parameter');
        expect(response.body.statusCode).toEqual(400);
        expect(response.body.fixList).toEqual({
            id: ['id is not a numeric string']
        });
        done();
    });
});
