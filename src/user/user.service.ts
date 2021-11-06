import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Apartment } from 'src/apartment/apartment.schema';
import { CreateUserDTO } from './user.dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDTO): Promise<User> {
    console.log(createUserDto);

    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().sort('-createdAt').exec();
  }

  async listFavorites(userId: string): Promise<Apartment[]> {
    return (
      await this.userModel
        .findOne({ _id: userId }, 'favorites')
        .populate('favorites')
        .exec()
    ).favorites as Apartment[];
  }

  async switchFavorite(apartmentId: string, userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();

    // (user.favorites as string[]) is because this time we don't need "favorites" field to be populated
    if (
      (user.favorites as string[]).some((x) => x.toString() === apartmentId)
    ) {
      // if the user already marked this apartment as favorite, delete it from the list
      (user.favorites as string[]).splice(
        (user.favorites as string[]).findIndex(
          (x) => x.toString() === apartmentId,
        ),
        1,
      );
    } else {
      (user.favorites as string[]).push(apartmentId);
    }

    return (await user.save()).populate('favorites');
  }
}
