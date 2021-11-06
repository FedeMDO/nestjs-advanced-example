import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ApartmentModule } from './apartment/apartment.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URL),
    UserModule,
    ApartmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
