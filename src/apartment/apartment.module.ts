import { Module } from '@nestjs/common';
import { ApartmentService } from './apartment.service';
import { ApartmentController } from './apartment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ApartmentSchema } from './apartment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Apartment',
        schema: ApartmentSchema,
      },
    ]),
  ],
  providers: [ApartmentService],
  controllers: [ApartmentController],
  exports: [ApartmentService],
})
export class ApartmentModule {}
