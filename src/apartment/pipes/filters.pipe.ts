import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { SearchFilters } from '../apartment.dto';

@Injectable()
export class ParseSearchFiltersPipe implements PipeTransform<string, number> {
  transform(value: any, metadata: ArgumentMetadata): number {
    Object.assign(value, {
      cityName:
        typeof value.cityName === 'string' && value.cityName.length
          ? value.cityName.split(',')
          : undefined,
      countryName:
        typeof value.countryName === 'string' && value.countryName.length
          ? value.countryName.split(',')
          : undefined,
      latitude:
        typeof value.latitude === 'string' && (value.latitude as string).length
          ? Number(value.latitude)
          : undefined,
      longitude:
        typeof value.longitude === 'string' &&
        (value.longitude as string).length
          ? Number(value.longitude)
          : undefined,
      maxDistance:
        typeof value.maxDistance === 'string' &&
        (value.maxDistance as string).length
          ? Number(value.maxDistance)
          : undefined,
      nbRooms:
        typeof value.nbRooms === 'string' && (value.nbRooms as string).length
          ? Number(value.nbRooms)
          : undefined,
      isAvailable:
        value.isAvailable?.toString() === 'true'
          ? true
          : value.isAvailable?.toString() === 'false'
          ? false
          : undefined,
    } as Partial<SearchFilters>);

    return value;
  }
}
