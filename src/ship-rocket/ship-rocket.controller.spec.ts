import { Test, TestingModule } from '@nestjs/testing';
import { ShipRocketController } from './ship-rocket.controller';

describe('ShipRocketController', () => {
  let controller: ShipRocketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShipRocketController],
    }).compile();

    controller = module.get<ShipRocketController>(ShipRocketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
