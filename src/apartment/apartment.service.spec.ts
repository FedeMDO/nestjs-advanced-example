import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Apartment } from './apartment.schema';
import { ApartmentService } from './apartment.service';
import { haversineDistance } from './geolocation.util';
import { ParseSearchFiltersPipe } from './pipes/filters.pipe';

describe('ApartmentService', () => {
  // let service: ApartmentService;

  beforeEach(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   providers: [ApartmentService],
    // }).compile();
    // service = module.get<ApartmentService>(ApartmentService);
  });

  it('should calculate distance between cologne and buenos aires', () => {
    // cologne cathedral
    const lat1 = 50.9416572;
    const lon1 = 6.9584852;

    // buenos aires obelisco
    const lat2 = -34.6037389;
    const lon2 = -58.3837591;

    expect(
      Math.floor(haversineDistance(lat1, lon1, lat2, lon2, 'K')),
    ).toStrictEqual(11450); // source gmaps
  });

  it('should transform a URL query set of params into a SearchFilters object', () => {
    const queryParams = {
      latitude: '10',

      longitude: '20',

      maxDistance: '30',

      cityName: 'Barcelona',

      countryName: 'USA,Argentina,Spain,Germany',

      nbRooms: '4',

      isAvailable: 'true',
    };

    const expected = {
      latitude: 10,

      longitude: 20,

      maxDistance: 30,

      cityName: ['Barcelona'],

      countryName: ['USA', 'Argentina', 'Spain', 'Germany'],

      nbRooms: 4,

      isAvailable: true,
    };

    const parser = new ParseSearchFiltersPipe();

    const transformed = parser.transform(queryParams, null);

    expect(transformed).toStrictEqual(expected);
  });
});
