import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Apartment } from '../apartment/apartment.schema';

export type UserDocument = User & mongoose.Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Apartment' }])
  favorites: Apartment[] | string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
