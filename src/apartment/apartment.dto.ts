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
  name: string;
  landlordUser: string;
  locationInfo: ApartmentLocationInfo;
  facilitiesInfo: ApartmentFacilitiesInfo;
}
