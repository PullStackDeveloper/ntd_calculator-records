import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
