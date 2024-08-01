import { Test, TestingModule } from '@nestjs/testing';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';
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

const mockRecordService = {
  create: jest.fn().mockResolvedValue(mockRecord),
  findOne: jest.fn().mockResolvedValue(mockRecord),
  findAll: jest.fn().mockResolvedValue({
    data: [mockRecord],
    count: 1,
  }),
  remove: jest.fn().mockResolvedValue(undefined),
};

describe('RecordController', () => {
  let controller: RecordController;
  let service: RecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecordController],
      providers: [
        {
          provide: RecordService,
          useValue: mockRecordService,
        },
      ],
    }).compile();

    controller = module.get<RecordController>(RecordController);
    service = module.get<RecordService>(RecordService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new record', async () => {
      const createRecordDto: CreateRecordDto = {
        operationType: 'deposit',
        amount: 100,
        userBalance: 1000,
        operationResponse: 'success',
        userId: 1,
      };
      const req = { user: { id: 1 } };
      const result = await controller.create(createRecordDto, req as any);
      expect(result).toEqual({
        id: 1,
        operationType: 'deposit',
        amount: 100,
        userBalance: 1000,
        operationResponse: 'success',
        date: expect.any(Date),
        userId: 1,
        isDeleted: false,
      });
      expect(service.create).toHaveBeenCalledWith(createRecordDto);
    });
  });

  describe('findOne', () => {
    it('should return a single record', async () => {
      const req = { user: { id: 1 } };
      const result = await controller.findOne(1, req as any);
      expect(result).toEqual({
        id: 1,
        operationType: 'deposit',
        amount: 100,
        userBalance: 1000,
        operationResponse: 'success',
        date: expect.any(Date),
        userId: 1,
        isDeleted: false,
      });
      expect(service.findOne).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('findAll', () => {
    it('should return a list of records and the total count', async () => {
      const req = { user: { id: 1 } };
      const result = await controller.findAll(req as any, 1, 10);
      expect(result).toEqual({
        data: [{
          id: 1,
          operationType: 'deposit',
          amount: 100,
          userBalance: 1000,
          operationResponse: 'success',
          date: expect.any(Date),
          userId: 1,
          isDeleted: false,
        }],
        count: 1,
      });
      expect(service.findAll).toHaveBeenCalledWith(1, { page: 1, limit: 10 });
    });
  });

  describe('remove', () => {
    it('should mark a record as deleted', async () => {
      const req = { user: { id: 1 } };
      await controller.remove(1, req as any);
      expect(service.remove).toHaveBeenCalledWith(1, 1);
    });
  });
});
