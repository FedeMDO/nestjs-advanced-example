import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Apartment } from '../apartment/apartment.schema';
import { CreateUserDTO } from './user.dto';
import { User } from './user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDTO): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  // TODO get userId from JWT
  @Get('/:userId/favorite')
  async listFavorites(@Param('userId') userId: string): Promise<Apartment[]> {
    return this.userService.listFavorites(userId);
  }

  @Patch('/favorite')
  async switchFavorite(
    @Body('apartmentId') apartmentId: string,
    @Body('userId') userId: string,
  ): Promise<User> {
    return this.userService.switchFavorite(apartmentId, userId);
  }
}
