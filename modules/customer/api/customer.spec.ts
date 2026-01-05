import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';

describe('CustomerController', () => {
  let controller: CustomerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
  });

  describe('getCustomers', () => {
    it('should return empty array', async () => {
      expect(await controller.getCustomers()).toEqual([]);
    });
  });
});
