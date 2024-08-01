import { Test, TestingModule } from '@nestjs/testing';
import { BalanceService } from './balance.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Balance } from './balance.entity';
import { Repository } from 'typeorm';

const mockBalance = {
  id: 1,
  amount: 100,
  userId: 1,
};

const mockBalanceRepository = {
  findOne: jest.fn().mockResolvedValue(mockBalance),
  save: jest.fn().mockResolvedValue(mockBalance),
};

describe('BalanceService', () => {
  let service: BalanceService;
  let repository: Repository<Balance>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceService,
        {
          provide: getRepositoryToken(Balance),
          useValue: mockBalanceRepository,
        },
      ],
    }).compile();

    service = module.get<BalanceService>(BalanceService);
    repository = module.get<Repository<Balance>>(getRepositoryToken(Balance));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBalance', () => {
    it('should return the balance of the user', async () => {
      const result = await service.getBalance(1);
      expect(result).toEqual(mockBalance);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { userId: 1 } });
    });
  });

  describe('updateBalance', () => {
    it('should update and return the updated balance', async () => {
      const result = await service.updateBalance(1, 200);
      expect(result).toEqual(mockBalance);
      expect(repository.save).toHaveBeenCalledWith({
        ...mockBalance,
        amount: 200,
      });
    });
  });
});
