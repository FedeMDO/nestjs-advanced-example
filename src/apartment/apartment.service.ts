import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateApartmentDTO, SearchFilters } from './apartment.dto';
import { Apartment, ApartmentDocument } from './apartment.schema';
import { haversineDistance } from './geolocation.util';

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
    searchFilters: Partial<SearchFilters>,
  ): Promise<Apartment[]> {
    const $and = [];
    if (Array.isArray(searchFilters.cityName)) {
      const $or = searchFilters.cityName.map((x) => {
        return { 'locationInfo.cityName': x };
      });
      $and.push({ $or });
    }

    if (Array.isArray(searchFilters.countryName)) {
      const $or = searchFilters.countryName.map((x) => {
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

  // for testing
  async dropCollection(): Promise<boolean> {
    return this.apartmentModel.collection.drop();
  }

  private shouldFilterByDistance(
    searchFilters: Partial<SearchFilters>,
  ): boolean {
    return (
      typeof searchFilters.latitude === 'number' &&
      typeof searchFilters.longitude === 'number' &&
      typeof searchFilters.maxDistance === 'number'
    );
  }
}
