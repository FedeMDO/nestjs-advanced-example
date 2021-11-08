import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserService } from '../user/user.service';

const mockUser = {
  _id: 'xxxxxxxxxxxxxxxx',
  username: 'federico',
  email: 'email@email.com',
  password: 'changeme',
  favorites: [],
};

describe('validateUser', () => {
  let service: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '240s' },
        }),
      ],
      providers: [
        AuthService,
        JwtStrategy,
        // mock userService because it connects to db
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn().mockResolvedValue((id) => undefined),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UserService>(UserService);
  });

  it('should return a user object when credentials are valid', async () => {
    // mock findOne fx
    jest
      .spyOn(userService, 'findOne')
      .mockImplementation((id) => Promise.resolve(mockUser));

    const res = await service.validateUser('federico', 'changeme');
    expect(res.username).toEqual('federico');
  });

  it('should return null when credentials are invalid', async () => {
    const res = await service.validateUser('xxx', 'xxx');
    expect(res).toBeNull();
  });

  it('should return JWT object when credentials are valid', async () => {
    // mock findOne fx
    jest
      .spyOn(userService, 'findOne')
      .mockImplementation((id) => Promise.resolve(mockUser));

    const res = await service.login({
      _doc: {
        username: 'fefe',
        _id: 'xxx',
        whatever: {},
      },
    });

    expect(res.access_token).toBeDefined();
  });
});
