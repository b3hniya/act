import { Controller, Get, Post, Body } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Customer } from '@act/types';
import { AddCustomerCommand } from '../application/command/add-customer/add-customer.command';
import { GetCustomerListQuery } from '../application/query/get-customer-list/get-customer-list.query';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getCustomers(): Promise<Customer[]> {
    return this.queryBus.execute(new GetCustomerListQuery());
  }

  @Post()
  async createCustomer(@Body() body: { name: string; email: string }): Promise<Customer> {
    return this.commandBus.execute(new AddCustomerCommand(body.name, body.email));
  }
}
