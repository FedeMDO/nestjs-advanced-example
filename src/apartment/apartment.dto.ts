import { IsBooleanString, IsNotEmpty, IsNumberString } from 'class-validator';

export class ApartmentLocationInfo {
  latitude: number;
  longitude: number;
  cityName: string;
  countryName: string;
}

export class ApartmentFacilitiesInfo {
  nbRooms: number;
}

export class CreateApartmentDTO {
  @IsNotEmpty()
  name: string;

  landlordUser: string;

  @IsNotEmpty()
  locationInfo: ApartmentLocationInfo;

  @IsNotEmpty()
  facilitiesInfo: ApartmentFacilitiesInfo;
}

export class SearchFilters {
  latitude: number;

  longitude: number;

  maxDistance: number;

  cityName: string[];

  countryName: string[];

  nbRooms: number;

  isAvailable: boolean;
}

export class SearchFiltersDTO {
  @IsNumberString()
  latitude?: string;

  @IsNumberString()
  longitude?: string;

  @IsNumberString()
  maxDistance?: string;

  cityName?: string;

  countryName?: string;

  @IsNumberString()
  nbRooms?: string;

  @IsBooleanString()
  isAvailable?: string;
}
