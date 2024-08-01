import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req, Version
} from "@nestjs/common";
import { RecordService } from './record.service';
import { Record } from './record.entity';
import { Request } from 'express';
import { CreateRecordDto } from './dto/create-record.dto';

@Controller('records')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Post()
  @Version('1')
  async create(
    @Body() createRecordDto: CreateRecordDto,
    @Req() req: Request,
  ): Promise<Record> {
    return this.recordService.create(createRecordDto);
  }

  @Get(':id')
  @Version('1')
  async findOne(@Param('id') id: number, @Req() req: Request): Promise<Record> {
    return this.recordService.findOne(id, req['user'].id);
  }

  @Get()
  @Version('1')
  async findAll(
    @Req() req: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ data: Record[]; count: number }> {
    return this.recordService.findAll(req['user'].id, { page, limit });
  }

  @Delete(':id')
  @Version('1')
  async remove(@Param('id') id: number, @Req() req: Request): Promise<void> {
    return this.recordService.remove(id, req['user'].id);
  }
}
