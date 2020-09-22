import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { NotFoundExceptionFilter } from '../../src/common/filters/not-found-exception.filter';
import * as request from 'supertest';
import { UserRepositoryTest } from './user-repository-test';
import { ContactRepositoryTest } from './contact-repository-test';

describe('Contact Module (e2e)', () => {
    let app: INestApplication;
    let userRepositoryTest: UserRepositoryTest;
    let contactRepositoryTest: ContactRepositoryTest;

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
    const validContactDataList = [
        {
            contactName: 'Maria Fernandez',
            phone: '+34667988726'
        },
        {
            contactName: 'Francisco Orenes',
            phone: '+34667988727'
        },
        {
            contactName: 'Miriam Ortega',
            phone: '+34667988728'
        },
        {
            contactName: 'Valeria Galera',
            phone: '+34667988729'
        },
        {
            contactName: 'Victor Osuna',
            phone: '+34667988730'
        }
    ];
    const generateSubList = (indexes: any[], list: any[]) => {
        return indexes.map(index => {
            return list[index];
        });
    };

    const updateUsers = [
        generateSubList([0, 2, 4], validContactDataList),
        generateSubList([0, 1, 3], validContactDataList),
        generateSubList([1, 2, 3, 4], validContactDataList)
    ];

    const matchingList_First_Second = generateSubList([0], validContactDataList);
    const matchingList_Second_Third = generateSubList([1, 3], validContactDataList);
    const matchingList_First_Third = generateSubList([2, 4], validContactDataList);

    beforeAll(async () => {
        process.env.NODE_ENV = 'testing';

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule, HttpModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalFilters(new NotFoundExceptionFilter());

        userRepositoryTest = new UserRepositoryTest(app);
        contactRepositoryTest = new ContactRepositoryTest(app);

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Cases', () => {
        it('(POST /api/v1/users) Create valid users', async done => {
            validUserDataList.forEach(user => userRepositoryTest.createValidUser(user));
            done();
        });

        it("(GET /api/v1/users/:id/contacts) Get user's empty contact list", async done => {
            const userValidList = await userRepositoryTest.getListUser();
            let contactList: any;
            for (let index = 0; index < userValidList.length; index++) {
                contactList = await contactRepositoryTest.getContactList(userValidList[index]);
                expect(contactList.length).toEqual(0);
            }

            done();
        });

        it("(PUSH /api/v1/users/:id/contacts) Updating user's contact list", async done => {
            const userValidList = await userRepositoryTest.getListUser();

            for (let index = 0; index < userValidList.length; index++) {
                await contactRepositoryTest.updateContactList(
                    userValidList[index],
                    updateUsers[index]
                );
            }

            done();
        });

        it("(GET /api/v1/users/:id/contacts) Get user's updated contact list", async done => {
            const userValidList = await userRepositoryTest.getListUser();
            let contactList: any;

            for (let index = 0; index < userValidList.length; index++) {
                contactList = await contactRepositoryTest.getContactList(userValidList[index]);
                expect(contactList.length).toEqual(updateUsers[index].length);
                expect(contactList).toEqual(updateUsers[index]);
            }

            done();
        });

        it('(GET /api/v1/users/:id1,:id2/contacts) Get the list of matching contacts between two users', async done => {
            const userValidList = await userRepositoryTest.getListUser();
            expect(userValidList.length).toEqual(3);
            expect(userValidList).toEqual(userValidList);

            let matchingList = await contactRepositoryTest.getMatchingContactList(
                userValidList[0],
                userValidList[1]
            );
            expect(matchingList.length).toEqual(matchingList_First_Second.length);
            expect(matchingList).toEqual(matchingList_First_Second);

            matchingList = await contactRepositoryTest.getMatchingContactList(
                userValidList[1],
                userValidList[2]
            );
            expect(matchingList.length).toEqual(matchingList_Second_Third.length);
            expect(matchingList).toEqual(matchingList_Second_Third);

            matchingList = await contactRepositoryTest.getMatchingContactList(
                userValidList[0],
                userValidList[2]
            );
            expect(matchingList.length).toEqual(matchingList_First_Third.length);
            expect(matchingList).toEqual(matchingList_First_Third);

            done();
        });

        it("(PATCH /api/v1/users/:id/contacts) Partially update user's contact list", async done => {
            const userValidList = await userRepositoryTest.getListUser();
            const phoneListFromValidContactDataList = validContactDataList.map(({ phone }) => {
                return phone;
            });
            phoneListFromValidContactDataList.sort();

            await contactRepositoryTest.updatePartialContactList(userValidList[0], updateUsers[2]);
            await contactRepositoryTest.updatePartialContactList(userValidList[1], updateUsers[2]);
            await contactRepositoryTest.updatePartialContactList(userValidList[2], updateUsers[0]);

            let contactList: any;
            for (let index = 0; index < userValidList.length; index++) {
                contactList = (
                    await contactRepositoryTest.getContactList(userValidList[index])
                ).map(({ phone }) => {
                    return phone;
                });
                contactList.sort();
                expect(contactList.length).toEqual(phoneListFromValidContactDataList.length);
                expect(contactList).toEqual(phoneListFromValidContactDataList);
            }

            done();
        });
    });

    describe('Error Cases', () => {
        it('(GET /api/v1/users/:id/contacts) throws error if id does not match to a registered user', async done => {
            const response = await request(app.getHttpServer())
                .get('/api/v1/users/9999999/contacts')
                .expect(400);

            expect(response.body.error).toEqual('user_not_found');
            expect(response.body.statusCode).toEqual(400);
            done();
        });

        it('(GET /api/v1/users/:id/contacts) throws error if id is not a number', async done => {
            const response = await request(app.getHttpServer())
                .get('/api/v1/users/isNotAId/contacts')
                .expect(400);

            expect(response.body.error).toEqual('invalid_url_parameter');
            expect(response.body.statusCode).toEqual(400);
            expect(response.body.fixList).toEqual({
                id: ['id is not a integer']
            });
            done();
        });

        it('(PUSH /api/v1/users/:id/contacts) throws error if id does not match to a registered user', async done => {
            const response = await request(app.getHttpServer())
                .put('/api/v1/users/9999999/contacts')
                .send(validContactDataList)
                .expect(400);

            expect(response.body.error).toEqual('user_not_found');
            expect(response.body.statusCode).toEqual(400);
            done();
        });

        it('(PUSH /api/v1/users/:id/contacts) throws error if id is not a number', async done => {
            const response = await request(app.getHttpServer())
                .put('/api/v1/users/isNotAId/contacts')
                .send(validContactDataList)
                .expect(400);

            expect(response.body.error).toEqual('invalid_url_parameter');
            expect(response.body.statusCode).toEqual(400);
            done();
        });

        it('(PATCH /api/v1/users/:id/contacts) throws error if id does not match to a registered user', async done => {
            const response = await request(app.getHttpServer())
                .put('/api/v1/users/9999999/contacts')
                .send(validContactDataList)
                .expect(400);

            expect(response.body.error).toEqual('user_not_found');
            expect(response.body.statusCode).toEqual(400);
            done();
        });

        it('(PATCH /api/v1/users/:id/contacts) throws error if id is not a number', async done => {
            const response = await request(app.getHttpServer())
                .put('/api/v1/users/isNotAId/contacts')
                .send(validContactDataList)
                .expect(400);

            expect(response.body.error).toEqual('invalid_url_parameter');
            expect(response.body.statusCode).toEqual(400);
            done();
        });

        it('(GET /api/v1/users/:id1,:id2/contacts) throws error if id1 does not match to a registered user', async done => {
            const response = await request(app.getHttpServer())
                .get('/api/v1/users/9999999,1/contacts')
                .expect(400);

            expect(response.body.error).toEqual('user_not_found');
            expect(response.body.statusCode).toEqual(400);
            done();
        });

        it('(GET /api/v1/users/:id1,:id2/contacts) throws error if id2 does not match to a registered user', async done => {
            const response = await request(app.getHttpServer())
                .get('/api/v1/users/1,9999999/contacts')
                .expect(400);

            expect(response.body.error).toEqual('user_not_found');
            expect(response.body.statusCode).toEqual(400);
            done();
        });

        it('(GET /api/v1/users/:id1,:id2/contacts) throws error if id1 is not a number', async done => {
            const response = await request(app.getHttpServer())
                .get('/api/v1/users/isNotAId,2/contacts')
                .expect(400);

            expect(response.body.error).toEqual('invalid_url_parameter');
            expect(response.body.statusCode).toEqual(400);
            expect(response.body.fixList).toEqual({
                id1: ['id1 is not a integer']
            });
            done();
        });

        it('(GET /api/v1/users/:id1,:id2/contacts) throws error if id2 is not a number', async done => {
            const response = await request(app.getHttpServer())
                .get('/api/v1/users/1,isNotAId/contacts')
                .expect(400);

            expect(response.body.error).toEqual('invalid_url_parameter');
            expect(response.body.statusCode).toEqual(400);
            expect(response.body.fixList).toEqual({
                id2: ['id2 is not a integer']
            });
            done();
        });
    });
});
