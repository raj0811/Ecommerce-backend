import { Test, TestingModule } from '@nestjs/testing';
import { SupportTicketController } from './support-ticket.controller';

describe('SupportTicketController', () => {
  let controller: SupportTicketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupportTicketController],
    }).compile();

    controller = module.get<SupportTicketController>(SupportTicketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
