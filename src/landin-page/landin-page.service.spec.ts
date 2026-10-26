import { Test, TestingModule } from '@nestjs/testing';
import { LandinPageService } from './landin-page.service';

describe('LandinPageService', () => {
  let service: LandinPageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LandinPageService],
    }).compile();

    service = module.get<LandinPageService>(LandinPageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
