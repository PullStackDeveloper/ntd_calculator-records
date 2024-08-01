import { Test, TestingModule } from '@nestjs/testing';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { UpdateBalanceDto } from './dto/update-balance.dto';

const mockBalanceService = {
  getBalance: jest.fn().mockResolvedValue({ id: 1, amount: 100, userId: 1 }),
  updateBalance: jest.fn().mockResolvedValue({ id: 1, amount: 200, userId: 1 }),
};

describe('BalanceController', () => {
  let controller: BalanceController;
  let service: BalanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BalanceController],
      providers: [
        {
          provide: BalanceService,
          useValue: mockBalanceService,
        },
      ],
    }).compile();

    controller = module.get<BalanceController>(BalanceController);
    service = module.get<BalanceService>(BalanceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getBalance', () => {
    it('should return the balance of the user', async () => {
      const req = { user: { id: 1 } };
      const result = await controller.getBalance(req as any);
      expect(result).toEqual({ id: 1, amount: 100, userId: 1 });
      expect(service.getBalance).toHaveBeenCalledWith(1);
    });
  });

  describe('updateBalance', () => {
    it('should update and return the updated balance', async () => {
      const req = { user: { id: 1 } };
      const updateBalanceDto: UpdateBalanceDto = { amount: 200 };
      const result = await controller.updateBalance(
        req as any,
        updateBalanceDto,
      );
      expect(result).toEqual({ id: 1, amount: 200, userId: 1 });
      expect(service.updateBalance).toHaveBeenCalledWith(1, 200);
    });
  });
});
