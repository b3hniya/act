import { Controller, Get } from '@nestjs/common';
import { Customer } from '@act/types';

@Controller('customer')
export class CustomerController {
  constructor() {}

  @Get()
  async getCustomers(): Promise<Customer[]> {
    return [];
  }
}
