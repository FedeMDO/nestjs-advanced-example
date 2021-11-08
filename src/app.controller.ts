import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ApartmentService } from './apartment/apartment.service';

import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { LoginDTO } from './user/user.dto';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly apartmentService: ApartmentService,
    private readonly userService: UserService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiBody({ type: LoginDTO })
  @ApiTags('Authentication')
  @UseGuards(LocalAuthGuard)
  @Post('/auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // for e2e testing
  @Post('/drop-collections')
  async dropCollections(): Promise<boolean> {
    return (
      (await this.userService.dropCollection()) &&
      (await this.apartmentService.dropCollection())
    );
  }
}
