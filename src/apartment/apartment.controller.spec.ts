import { Test, TestingModule } from '@nestjs/testing';
import { ApartmentController } from './apartment.controller';

describe('ApartmentController', () => {
  let controller: ApartmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApartmentController],
    }).compile();

    controller = module.get<ApartmentController>(ApartmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
