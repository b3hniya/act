import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetCustomerListQuery } from './get-customer-list.query';

@QueryHandler(GetCustomerListQuery)
export class GetCustomerListHandler implements IQueryHandler<GetCustomerListQuery> {
  async execute(query: GetCustomerListQuery) {
    const { page, limit } = query;
    // Example: Implementation with pagination
    console.log(`Fetching customers page ${page} with limit ${limit}`);
    return [];
  }
}
