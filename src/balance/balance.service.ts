import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Balance } from './balance.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Balance)
    private balanceRepository: Repository<Balance>,
  ) {}

  async getBalance(userId: number): Promise<Balance> {
    return this.balanceRepository.findOne({ where: { userId } });
  }

  async updateBalance(userId: number, amount: number): Promise<Balance> {
    const balance = await this.getBalance(userId);
    balance.amount = amount;
    return this.balanceRepository.save(balance);
  }
}
