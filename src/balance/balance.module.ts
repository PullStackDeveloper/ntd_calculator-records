import { Module } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { BalanceController } from './balance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Balance } from './balance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Balance])],
  providers: [BalanceService],
  controllers: [BalanceController],
})
export class BalanceModule {}
