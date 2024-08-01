import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRecordDto {
  @IsString()
  @IsNotEmpty()
  operationType: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  userBalance: number;

  @IsString()
  @IsNotEmpty()
  operationResponse: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
