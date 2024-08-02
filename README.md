# NTD Calculator Record - Technical Documentation

## Overview

The NTD Calculator Record service is a backend application built with NestJS, designed to manage balance and record operations for users. It includes token validation from an external authentication service and provides endpoints for CRUD operations and pagination.

## Installation

### Prerequisites

- Node.js (version 16 or later)
- Docker
- NestJS CLI

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/PullStackDeveloper/ntd_calculator-records.git
   cd ntd-calculator-record
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root directory with the following content:
   ```plaintext
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=ntd_user
   DB_PASSWORD=set-your-password
   DB_NAME=ntd_calculator
   AUTH_API_URL=http://localhost:4000/api/v1/auth/validate-token
   ```

4. **Run MySQL using Docker**:
   Pull the Docker image:
   ```bash
   docker pull fernando0988/ntd_calculator_image:latest
   ```

   Run the Docker container:
   ```bash
   docker run --name ntd_calculator-container -e MYSQL_ROOT_PASSWORD=set-your-password -e MYSQL_DATABASE=ntd_calculator -e MYSQL_USER=ntd_user -e MYSQL_PASSWORD=set-your-password -p 3306:3306 -d fernando0988/ntd_calculator_image:latest
   ```

5. **Run the application**:
   ```bash
   yarn start:dev
   ```

## Project Structure

- `src`
    - `balance`
        - `dto`
            - `update-balance.dto.ts`: Data Transfer Object for updating balance.
        - `balance.controller.ts`: Controller handling balance-related routes.
        - `balance.entity.ts`: Entity representing the balance table.
        - `balance.module.ts`: Module encapsulating balance-related components.
        - `balance.service.ts`: Service handling business logic for balance operations.
    - `common`
        - `interceptors`
            - `auth.interceptor.ts`: Interceptor for token validation.
    - `record`
        - `dto`
            - `create-record.dto.ts`: Data Transfer Object for creating records.
        - `interface`
            - `pagination.interface.ts`: Interface for pagination options.
        - `record.controller.ts`: Controller handling record-related routes.
        - `record.entity.ts`: Entity representing the record table.
        - `record.module.ts`: Module encapsulating record-related components.
        - `record.service.ts`: Service handling business logic for record operations.
    - `app.controller.ts`: Main application controller.
    - `app.module.ts`: Main application module.
    - `main.ts`: Entry point of the application.

## Key Concepts

### Token Validation

The application uses an `AuthInterceptor` to validate tokens provided in the `Authorization` header of incoming requests. The token is validated against an external authentication service specified by the `AUTH_API_URL` environment variable.

### Controllers and Services

#### BalanceController

- **getBalance**: Retrieves the balance of the authenticated user.
- **updateBalance**: Updates the balance of the authenticated user.

```typescript
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
```

#### BalanceService

- **getBalance**: Retrieves the balance for a given user ID.
- **updateBalance**: Updates the balance for a given user ID.

```typescript
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
```

#### RecordController

- **create**: Creates a new record.
- **findOne**: Retrieves a specific record by its ID.
- **findAll**: Retrieves all records for the authenticated user with pagination.
- **remove**: Marks a record as deleted.

```typescript
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
```

#### RecordService

- **create**: Creates and saves a new record.
- **findOne**: Retrieves a specific record by its ID and user ID.
- **findAll**: Retrieves all records for a user with pagination options.
- **remove**: Marks a record as deleted.

```typescript
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
```

### DTOs (Data Transfer Objects)

#### UpdateBalanceDto

Defines the structure of data required to update a balance.

```typescript
export class UpdateBalanceDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
```

#### CreateRecordDto

Defines the structure of data required to create a record.

```typescript
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
```

### Pagination

The `PaginationOptions` interface defines the structure for pagination parameters.

```typescript
export interface PaginationOptions {
  page: number;
  limit: number;
}
```

The `RecordService` uses these options to paginate the results in the `findAll` method.

### Entity Definitions

Entities represent the database tables. They are defined using TypeORM decorators.

#### Balance Entity

Represents the `balance` table.

```typescript
@Entity()
@Unique(['userId'])
export class Balance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('double')
  amount: number;

  @Column()
  userId: number;
}
```

#### Record Entity

Represents the `record` table.

```typescript
@Entity()
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  operationType: string;

  @Column('decimal')
  amount: number;

  @Column('decimal')
  userBalance: number;

  @Column()
  operationResponse: string;

  @CreateDateColumn()
  date: Date;

  @Column()
  userId: number;

  @Column({ default: false })
  isDeleted: boolean;
}
```