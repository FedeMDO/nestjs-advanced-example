import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateApartmentDTO,
  SearchFilters,
  SearchFiltersDTO,
} from './apartment.dto';
import { Apartment } from './apartment.schema';
import { ApartmentService } from './apartment.service';
import { ParseSearchFiltersPipe } from './pipes/filters.pipe';

@Controller('apartment')
export class ApartmentController {
  constructor(private readonly apartmentService: ApartmentService) {}

  @ApiBearerAuth()
  @ApiTags('Apartment')
  @UseGuards(JwtAuthGuard)
  @Post()
  async createApartment(
    @Body() createApartmentDto: CreateApartmentDTO,
    @Request() req,
  ): Promise<Apartment> {
    createApartmentDto.landlordUser = req.user._id; // from authenticated user
    return this.apartmentService.create(createApartmentDto);
  }

  /**
   * Get all apartments using optional filters
   * @param searchFilters cityName and countryName are comma-separated strings. In order to filter by distance,
   * you need to provide latitude, longitude and maxDistance at the same time
   *
   * @returns a collection of Apartments
   */
  @ApiQuery({ type: SearchFiltersDTO })
  @ApiTags('Apartment')
  @Get()
  async findAllApartments(
    @Query(new ParseSearchFiltersPipe()) searchFilters: Partial<SearchFilters>,
  ): Promise<Apartment[]> {
    return this.apartmentService.findAllWithFilters(searchFilters);
  }
}
