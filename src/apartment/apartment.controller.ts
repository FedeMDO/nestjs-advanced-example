import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateApartmentDTO } from './apartment.dto';
import { Apartment } from './apartment.schema';
import { ApartmentService, ISearchFilters } from './apartment.service';

@Controller('apartment')
export class ApartmentController {
  constructor(private readonly apartmentService: ApartmentService) {}

  @Post()
  async createApartment(
    @Body() createApartmentDto: CreateApartmentDTO,
  ): Promise<Apartment> {
    return this.apartmentService.create(createApartmentDto);
  }

  /**
   * Get all apartments using optional filters
   * @param searchFilters cityName and countryName are comma-separated strings. In order to filter by distance,
   * you need to provide latitude, longitude and maxDistance at the same time
   *
   * @returns a collection of Apartments
   */
  @Get()
  async findAllApartments(
    @Query() searchFilters: Partial<ISearchFilters>,
  ): Promise<Apartment[]> {
    return this.apartmentService.findAllWithFilters(
      this.apartmentService.transformSearchFilters(searchFilters),
    );
  }
}
