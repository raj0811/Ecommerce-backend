import { Test, TestingModule } from '@nestjs/testing';
import { LandinPageController } from './landin-page.controller';

describe('LandinPageController', () => {
  let controller: LandinPageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LandinPageController],
    }).compile();

    controller = module.get<LandinPageController>(LandinPageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
