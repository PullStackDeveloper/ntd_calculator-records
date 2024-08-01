import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

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
