import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

enum Status {
  PENDING = 'Pending',
  CLOSED = 'Closed',
  INPROGRESS = 'InProgress',
}

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: Status.PENDING })
  status: Status;

  @ManyToOne(() => User, (user) => user.tickets, { nullable: true })
  user: User;
}
