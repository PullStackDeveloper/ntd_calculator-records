import { Injectable } from '@nestjs/common';
import { Record } from './record.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecordDto } from './dto/create-record.dto';
import { PaginationOptions } from './interface/pagination.interface';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
  ) {}

  async create(createRecordDto: CreateRecordDto): Promise<Record> {
    const record = this.recordRepository.create(createRecordDto);
    return this.recordRepository.save(record);
  }

  async findOne(id: number, userId: number): Promise<Record> {
    return this.recordRepository.findOne({
      where: { id, userId, isDeleted: false },
    });
  }

  async findAll(
    userId: number,
    options: PaginationOptions,
  ): Promise<{ data: Record[]; count: number }> {
    const { page, limit } = options;
    const [data, count] = await this.recordRepository.findAndCount({
      where: { userId, isDeleted: false },
      skip: (page - 1) * limit,
      take: limit,
      order: { date: 'DESC' },
    });
    return { data, count };
  }

  async remove(id: number, userId: number): Promise<void> {
    const record = await this.recordRepository.findOne({
      where: { id, userId, isDeleted: false },
    });
    if (record) {
      await this.recordRepository.update(id, { isDeleted: true });
    }
  }
}
