import {
  Body,
  Controller,
  Get,
  Request,
  Patch,
  UseGuards,
  Post,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Apartment } from '../apartment/apartment.schema';
import { User } from './user.schema';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO, SwitchFavoriteDTO } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiTags('User')
  @Post('/register')
  async registerUser(@Body() createUserDto: CreateUserDTO): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @ApiTags('User')
  @Get()
  async findAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @ApiBearerAuth()
  @ApiTags('User')
  @UseGuards(JwtAuthGuard)
  @Get('/favorite')
  async listFavorites(@Request() req): Promise<Apartment[]> {
    return this.userService.listFavorites(req.user._id);
  }

  @ApiBearerAuth()
  @ApiTags('User')
  @UseGuards(JwtAuthGuard)
  @Patch('/favorite')
  async switchFavorite(
    @Body() body: SwitchFavoriteDTO,
    @Request() req,
  ): Promise<User> {
    return this.userService.switchFavorite(body.apartmentId, req.user._id);
  }

  @ApiBearerAuth()
  @ApiTags('User')
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Request() req) {
    return this.userService.findOne({ _id: req.user._id });
  }
}
