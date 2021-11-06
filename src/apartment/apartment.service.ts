import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateApartmentDTO } from './apartment.dto';
import { Apartment, ApartmentDocument } from './apartment.schema';
import { haversineDistance } from './geolocation.util';

export interface ISearchFilters {
  latitude?: string | number;
  longitude?: string | number;
  maxDistance?: string | number;
  cityName?: string | string[];
  countryName?: string | string[];
  nbRooms?: number;
  isAvailable?: boolean;
}

@Injectable()
export class ApartmentService {
  constructor(
    @InjectModel(Apartment.name)
    private apartmentModel: Model<ApartmentDocument>,
  ) {}

  async create(createApartmentDto: CreateApartmentDTO): Promise<Apartment> {
    const createdApartment = new this.apartmentModel({
      ...createApartmentDto,
      // init
      favorites: [],
      isAvailable: true,
    });
    return (await createdApartment.save()).populate('landlordUser');
  }

  async findAllWithFilters(
    searchFilters: Partial<ISearchFilters>,
  ): Promise<Apartment[]> {
    const query: Partial<Apartment> = {};
    console.log(searchFilters);
    const $and = [];
    if (
      typeof searchFilters.cityName === 'string' &&
      searchFilters.cityName.length
    ) {
      const splited = searchFilters.cityName.split(',');
      const $or = splited.map((x) => {
        return { 'locationInfo.cityName': x };
      });
      //   query['locationInfo.cityName'] = searchFilters.cityName;
      $and.push({ $or });
    }

    if (
      typeof searchFilters.countryName === 'string' &&
      searchFilters.countryName.length
    ) {
      const splited = searchFilters.countryName.split(',');
      const $or = splited.map((x) => {
        return { 'locationInfo.countryName': x };
      });
      $and.push({ $or });
    }

    if (typeof searchFilters.nbRooms === 'number') {
      $and.push({ 'facilitiesInfo.nbRooms': searchFilters.nbRooms });
    }

    if (typeof searchFilters.isAvailable === 'boolean') {
      $and.push({ isAvailable: searchFilters.isAvailable });
    }
    console.log($and);

    let result = await this.apartmentModel
      .find($and.length ? { $and } : undefined)
      .populate('landlordUser')
      .sort('-createdAt');

    // local matching by distance
    if (this.shouldFilterByDistance(searchFilters)) {
      result = result.filter(
        (x) =>
          Math.floor(
            haversineDistance(
              searchFilters.latitude as number,
              searchFilters.longitude as number,
              x.locationInfo.latitude as number,
              x.locationInfo.longitude as number,
              'K', // in kilometers
            ),
          ) <= searchFilters.maxDistance,
      );
    }
    return result;
  }

  // I had some problems trying to use class-validators/transformers so I will transform the filters myself (I have less than 3 days to finish the challenge)
  transformSearchFilters(
    searchFilters: Partial<ISearchFilters>,
  ): Partial<ISearchFilters> {
    Object.assign(searchFilters, {
      latitude:
        typeof searchFilters.latitude === 'string' &&
        (searchFilters.latitude as string).length
          ? Number(searchFilters.latitude)
          : undefined,
      longitude:
        typeof searchFilters.longitude === 'string' &&
        (searchFilters.longitude as string).length
          ? Number(searchFilters.longitude)
          : undefined,
      maxDistance:
        typeof searchFilters.maxDistance === 'string' &&
        (searchFilters.maxDistance as string).length
          ? Number(searchFilters.maxDistance)
          : undefined,
      nbRooms:
        typeof searchFilters.nbRooms === 'string' &&
        (searchFilters.nbRooms as string).length
          ? Number(searchFilters.nbRooms)
          : undefined,
      isAvailable:
        searchFilters.isAvailable?.toString() === 'true'
          ? true
          : searchFilters.isAvailable?.toString() === 'false'
          ? false
          : undefined,
    } as Partial<ISearchFilters>);

    return searchFilters;
  }

  private shouldFilterByDistance(
    searchFilters: Partial<ISearchFilters>,
  ): boolean {
    return (
      typeof searchFilters.latitude === 'number' &&
      typeof searchFilters.longitude === 'number' &&
      typeof searchFilters.maxDistance === 'number'
    );
  }
}
