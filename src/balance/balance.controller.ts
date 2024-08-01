import { Body, Controller, Get, Patch, Req, Version } from '@nestjs/common';
import { UpdateBalanceDto } from './DTO/update-balance.dto';
import { BalanceService } from './balance.service';
import { Request } from 'express';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get()
  @Version('1')
  async getBalance(@Req() req: Request) {
    return this.balanceService.getBalance(req['user'].id);
  }

  @Patch()
  @Version('1')
  async updateBalance(
    @Req() req: Request,
    @Body() updateBalanceDto: UpdateBalanceDto,
  ) {
    return this.balanceService.updateBalance(
      req['user'].id,
      updateBalanceDto.amount,
    );
  }
}
