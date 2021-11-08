import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Apartment } from '../apartment/apartment.schema';
import { CreateUserDTO } from './user.dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDTO): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    try {
      const result = await createdUser.save();
      result.password = undefined;
      return result;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('User already exist');
      }
    }
  }

  async findOne(
    filters: Partial<User & { _id: string }>,
    projection = {},
  ): Promise<User> {
    return this.userModel
      .findOne(filters, { password: 0, ...projection })
      .populate('favorites')
      .exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find({}, { password: 0 }).sort('-createdAt').exec(); // won't reveal user passwords
  }

  async listFavorites(userId: string): Promise<Apartment[]> {
    return (
      await this.userModel
        .findOne({ _id: userId }, { favorites: 1 })
        .populate('favorites')
        .exec()
    ).favorites as Apartment[];
  }

  /**
   * Switch favorite apartment.
   * If it is not on the favorites list, it add the apartmentId to it. If it is alrady inside, we put it out.
   * @param apartmentId
   * @param userId
   * @returns Resulting user with favorites array populated
   */
  async switchFavorite(apartmentId: string, userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();

    // (user.favorites as string[]) is because this time we don't need "favorites" field to be populated
    if (
      (user.favorites as string[]).some((x) => x.toString() === apartmentId)
    ) {
      // if the user has already marked this apartment as favorite, delete it from the list
      (user.favorites as string[]).splice(
        (user.favorites as string[]).findIndex(
          (x) => x.toString() === apartmentId,
        ),
        1,
      );
    } else {
      (user.favorites as string[]).push(apartmentId);
    }

    const result = await (await user.save()).populate('favorites');
    result.password = undefined;
    return result;
  }

  // for testing
  async dropCollection(): Promise<boolean> {
    return this.userModel.collection.drop();
  }
}
