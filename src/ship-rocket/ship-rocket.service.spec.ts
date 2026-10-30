import { Test, TestingModule } from '@nestjs/testing';
import { ShipRocketService } from './ship-rocket.service';

describe('ShipRocketService', () => {
  let service: ShipRocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShipRocketService],
    }).compile();

    service = module.get<ShipRocketService>(ShipRocketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
