import { Test, TestingModule } from '@nestjs/testing';
import { RecordService } from './record.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Record } from './record.entity';
import { Repository } from 'typeorm';
import { CreateRecordDto } from './dto/create-record.dto';

const mockRecord = {
  id: 1,
  operationType: 'deposit',
  amount: 100,
  userBalance: 1000,
  operationResponse: 'success',
  date: new Date(),
  userId: 1,
  isDeleted: false,
};

const mockRecordRepository = {
  create: jest.fn().mockReturnValue(mockRecord),
  save: jest.fn().mockResolvedValue(mockRecord),
  findOne: jest.fn().mockResolvedValue(mockRecord),
  findAndCount: jest.fn().mockResolvedValue([[mockRecord], 1]),
  update: jest.fn().mockResolvedValue(undefined),
};

describe('RecordService', () => {
  let service: RecordService;
  let repository: Repository<Record>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecordService,
        {
          provide: getRepositoryToken(Record),
          useValue: mockRecordRepository,
        },
      ],
    }).compile();

    service = module.get<RecordService>(RecordService);
    repository = module.get<Repository<Record>>(getRepositoryToken(Record));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new record', async () => {
      const createRecordDto: CreateRecordDto = {
        operationType: 'deposit',
        amount: 100,
        userBalance: 1000,
        operationResponse: 'success',
        userId: 1,
      };
      const result = await service.create(createRecordDto);
      expect(result).toEqual(mockRecord);
      expect(repository.create).toHaveBeenCalledWith(createRecordDto);
      expect(repository.save).toHaveBeenCalledWith(mockRecord);
    });
  });

  describe('findOne', () => {
    it('should return a single record', async () => {
      const result = await service.findOne(1, 1);
      expect(result).toEqual(mockRecord);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: 1, isDeleted: false },
      });
    });
  });

  describe('findAll', () => {
    it('should return a list of records and the total count', async () => {
      const result = await service.findAll(1, { page: 1, limit: 10 });
      expect(result).toEqual({ data: [mockRecord], count: 1 });
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { userId: 1, isDeleted: false },
        skip: 0,
        take: 10,
        order: { date: 'DESC' },
      });
    });
  });

  describe('remove', () => {
    it('should mark a record as deleted', async () => {
      await service.remove(1, 1);
      expect(repository.update).toHaveBeenCalledWith(1, { isDeleted: true });
    });
  });
});
