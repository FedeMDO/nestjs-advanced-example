import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Apartment } from '../src/apartment/apartment.schema';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('E2E JWT Sample', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modRef.createNestApplication();
    await app.init();
  });

  it('e2e tests', async () => {
    const registerUser = await request(app.getHttpServer())
      .post('/user/register')
      .send({
        username: 'federico',
        email: 'fede@nice.mail',
        password: 'changeme',
      })
      .expect(201);

    const loginReq = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'federico', password: 'changeme' })
      .expect(201);

    const token = loginReq.body.access_token;
    const profileRes = await request(app.getHttpServer())
      .get('/user/profile')
      .set('Authorization', 'Bearer ' + token)
      .expect(200);

    // create
    const newApartmentRes = await request(app.getHttpServer())
      .post('/apartment')
      .send({
        name: 'Big house in Cologne',
        landlordUser: profileRes.body._id,
        locationInfo: {
          // Cologne Cathedral
          latitude: 50.9412784,
          longitude: 6.9582814,
          cityName: 'Cologne',
          countryName: 'Germany',
        },
        facilitiesInfo: {
          nbRooms: 4,
        },
      })
      .set('Authorization', 'Bearer ' + token)
      .expect(201);

    // next step doesn't make much sense because we're going to mark his own apartment as favorite. but it would work for any user.
    const markFavoriteRes = await request(app.getHttpServer())
      .patch('/user/favorite')
      .send({
        apartmentId: newApartmentRes.body._id,
      })
      .set('Authorization', 'Bearer ' + token)
      .expect(200);

    // we check if the created apartment now exists on the user's favorites list.
    expect(
      (markFavoriteRes.body.favorites as Apartment[]).some(
        (x) => x.name === newApartmentRes.body.name,
      ),
    ).toBeTruthy();

    // second time we mark it, the apartment should dissapear from the user's favorites list (switch behavior)
    const markFavoriteRes2 = await request(app.getHttpServer())
      .patch('/user/favorite')
      .send({
        apartmentId: newApartmentRes.body._id,
      })
      .set('Authorization', 'Bearer ' + token)
      .expect(200);

    // we check if the created apartment now has been removed from the user's favorites list.
    expect(
      (markFavoriteRes2.body.favorites as Apartment[]).some(
        (x) => x.name === newApartmentRes.body.name,
      ),
    ).toBeFalsy();

    // let's check if our cologne apartment can be fetched using filters
    const getApartmentWithFiltersTruthy = await request(app.getHttpServer())
      .get('/apartment')
      .query({ cityName: 'Cologne' })
      .set('Authorization', 'Bearer ' + token)
      .expect(200);

    expect(
      (getApartmentWithFiltersTruthy.body as Apartment[]).some(
        (x) => x.name === 'Big house in Cologne',
      ),
    ).toBeTruthy();

    // if a search an apartment in other city, it shouldn't return any apartment.
    const getApartmentWithFiltersFalsy = await request(app.getHttpServer())
      .get('/apartment')
      .query({ cityName: 'Paris' })
      .set('Authorization', 'Bearer ' + token)
      .expect(200);

    expect(getApartmentWithFiltersFalsy.body).toHaveLength(0);

    // let's create another apartment in berlin
    const berlinApartmentRes = await request(app.getHttpServer())
      .post('/apartment')
      .send({
        name: 'Small apartment in Berlin',
        landlordUser: profileRes.body._id,
        locationInfo: {
          // Brandemburg Gate
          latitude: 52.51768068662791,
          longitude: 13.377504092480898,
          cityName: 'Berlin',
          countryName: 'Germany',
        },
        facilitiesInfo: {
          nbRooms: 3,
        },
      })
      .set('Authorization', 'Bearer ' + token)
      .expect(201);

    // let's suppose we are in Dortmund, and looking for an apartment up to 100km away.
    // the api should return the apartment in Cologne (70/80km away) and not the apartment in Berlin (+400km).
    // let's do it.
    const getApartmentWithFiltersDistances = await request(app.getHttpServer())
      .get('/apartment')
      .query({
        // Center of Dortmund
        latitude: 51.513605291743815,
        longitude: 7.465738609105617,
        maxDistance: 100,
      })
      .set('Authorization', 'Bearer ' + token)
      .expect(200);

    expect(getApartmentWithFiltersDistances.body).toHaveLength(1); // 1 result

    expect(
      (getApartmentWithFiltersDistances.body[0] as Apartment).name,
    ).toStrictEqual('Big house in Cologne');
  });

  afterAll(async () => {
    // drop user and apartment collection (must be sure to be in 'test' environment)
    await request(app.getHttpServer()).post('/drop-collections').expect(201);
    await app.close();
  });
});
