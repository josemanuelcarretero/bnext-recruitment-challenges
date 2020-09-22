import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { NotFoundExceptionFilter } from '../../src/common/filters/not-found-exception.filter';
import * as request from 'supertest';
import { ValidationErrorFilter } from '../../src/common/filters/validation-error.filter';
import { UserRepositoryTest } from './user-repository-test';
import { PhoneValidationFilter } from '../../src/common/filters/phone-validation.filter';
import { PhoneValidationService } from '../../src/modules/phone-validation/phone-validation.service';
import { InvalidPhoneException } from '../../src/modules/phone-validation/exceptions/invalid-phone.exception';

describe('User Module (e2e)', () => {
    let app: INestApplication;
    let userRepositoryTest: UserRepositoryTest;

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

    class MockPhoneValidationService {
        async verifyPhone(value: string): Promise<string> {
            if (value.startsWith('+34')) {
                return value;
            } else {
                throw new InvalidPhoneException();
            }
        }
    }

    beforeAll(async () => {
        process.env.NODE_ENV = 'testing';

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule, HttpModule]
        })
            .overrideProvider(PhoneValidationService)
            .useClass(MockPhoneValidationService)
            .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalFilters(new NotFoundExceptionFilter());
        app.useGlobalFilters(new ValidationErrorFilter());
        app.useGlobalFilters(new PhoneValidationFilter());
        userRepositoryTest = new UserRepositoryTest(app);

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });
    describe('Cases', () => {
        it('(GET /api/v1/users) Get an empty user list', async done => {
            const userList = await userRepositoryTest.getListUser();

            expect(userList.length).toEqual(0);

            done();
        });

        it('(POST /api/v1/users) Create two valid users', async done => {
            validUserDataList.forEach(user => userRepositoryTest.createValidUser(user));
            done();
        });

        it('(GET /api/v1/users) Get an user list', async done => {
            const userList = await userRepositoryTest.getListUser();

            expect(userList.length).toEqual(validUserDataList.length);

            for (let index = 0; index < userList.length; index++) {
                userRepositoryTest.checkUser(userList[index], validUserDataList[index]);
                expect(userList[index].id).not.toEqual(undefined);
            }
            expect(userList[1].id).toBeGreaterThan(userList[0].id);
            expect(userList[2].id).toBeGreaterThan(userList[1].id);

            done();
        });
        it('(GET /api/v1/users/:id) Get an registered user', async done => {
            const userList = await userRepositoryTest.getListUser();
            let registeredUser: any;
            for (let index = 0; index < userList.length; index++) {
                registeredUser = await userRepositoryTest.getValidUser(userList[index]);
                expect(registeredUser.id).toEqual(userList[index].id);
            }

            done();
        });
    });
    describe('Error Cases', () => {
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
            await userRepositoryTest.createInvalidUser(invalidUserDataList[0], {
                firstName: generatorFixList('firstName')
            });
            done();
        });

        it('(POST /api/v1/users) Throws error if you try to create an user with invalid data(without lastName)', async done => {
            await userRepositoryTest.createInvalidUser(invalidUserDataList[1], {
                lastName: generatorFixList('lastName')
            });
            done();
        });

        it('(POST /api/v1/users) Throws error if you try to create an user with invalid data(without phone)', async done => {
            await userRepositoryTest.createInvalidUser(invalidUserDataList[2], {
                phone: generatorFixList('phone', '50')
            });

            done();
        });

        it('(POST /api/v1/users) Throws error if you try to create an user with invalid data(firstName too short)', async done => {
            await userRepositoryTest.createInvalidUser(invalidUserDataList[3], {
                firstName: [generatorFixList('firstName')[2]]
            });

            done();
        });
        it('(POST /api/v1/users) Throws error if you try to create an user with invalid data(firstName too long)', async done => {
            await userRepositoryTest.createInvalidUser(invalidUserDataList[4], {
                firstName: [generatorFixList('firstName')[1]]
            });
            done();
        });

        it('(POST /api/v1/users) Throws error if you try to create an user with invalid phone(external service)', async done => {
            const { body } = await request(app.getHttpServer())
                .post('/api/v1/users')
                .send(invalidUserDataList[5])
                .expect(400);

            expect(body.statusCode).toEqual(400);
            expect(body.error).toEqual('invalid_phone_number');

            done();
        });

        it('(POST /api/v1/users) Throws error if you try to create an user with invalid data(with nothing)', async done => {
            await userRepositoryTest.createInvalidUser(
                {},
                {
                    firstName: generatorFixList('firstName'),
                    lastName: generatorFixList('lastName'),
                    phone: generatorFixList('phone', '50')
                }
            );
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
                id: ['id is not a integer']
            });
            done();
        });
    });
});
