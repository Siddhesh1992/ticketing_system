import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { Ticket } from 'src/entities/ticket.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,
    private readonly userService: UserService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto) {
    const user = await this.userService.findOne({ id: this.request.user });
    console.log(user);
    const { limit, offset } = paginationQuery;
    const obj = {
      relations: ['user', 'user.userType'],
      skip: offset,
      take: limit,
      where: undefined,
    };

    if (user.userType.id == 2) {
      obj.where = { user: user.id };
    }

    console.log(obj);
    return this.ticketRepo.find(obj);
  }

  async findTicket(id) {
    return this.ticketRepo.findOne(
      {
        id,
      },
      {
        relations: ['user', 'user.userType'],
      },
    );
  }

  update(id, body) {
    return this.ticketRepo.update(
      {
        id,
      },
      body,
    );
  }

  async createTicket(createTicket) {
    const user = await this.userService.findOne({ id: createTicket.user });
    if (!user) throw new NotFoundException('User Not Found');
    const ticket = this.ticketRepo.create(createTicket);
    return this.ticketRepo.save(ticket);
    // assign tickets to user
  }
}
