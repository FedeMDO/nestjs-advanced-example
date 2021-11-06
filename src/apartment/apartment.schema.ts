import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../user/user.schema';
import {
  ApartmentFacilitiesInfo,
  ApartmentLocationInfo,
} from './apartment.dto';

export type ApartmentDocument = Apartment & mongoose.Document;

@Schema({ timestamps: true })
export class Apartment {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  landlordUser: User;

  @Prop({ required: true })
  locationInfo: ApartmentLocationInfo;

  @Prop({ required: true })
  facilitiesInfo: ApartmentFacilitiesInfo;

  @Prop()
  isAvailable: boolean;
}

export const ApartmentSchema = SchemaFactory.createForClass(Apartment);
