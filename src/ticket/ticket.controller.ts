import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
// import { UserService } from 'src/user/user.service';
import { TicketService } from './ticket.service';

@UseGuards(JwtAuthGuard)
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get('/:ticketId')
  findOne(@Param('ticketId') id) {
    return this.ticketService.findTicket(id);
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.ticketService.findAll(paginationQuery);
  }

  @Post()
  createUser(@Body() createTicket) {
    return this.ticketService.createTicket(createTicket);
  }

  @Put('/:ticketId')
  updateOne(@Param('ticketId') id, @Body() body) {
    console.log(id);
    console.log(body);
    return this.ticketService.update(id, body);
  }
}
