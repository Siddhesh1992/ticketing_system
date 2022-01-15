import {
  Column,
  Entity,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Ticket } from './ticket.entity';
import { UserType } from './user.type';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  pass: string;

  @ManyToOne(() => UserType, (userType) => userType.users)
  @JoinColumn()
  userType: UserType;

  @OneToMany(() => Ticket, (ticket) => ticket.user, {
    cascade: true,
    nullable: true,
  })
  tickets: Ticket[];
}
