import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { AddCustomerCommand } from './add-customer.command';
import { CustomerAddedEvent } from '../../event/customer-added.event';

@CommandHandler(AddCustomerCommand)
export class AddCustomerHandler implements ICommandHandler<AddCustomerCommand> {
  constructor(private readonly eventBus: EventBus) {}

  async execute(command: AddCustomerCommand) {
    const { name, email } = command;

    // Create customer logic here...
    const customerId = 'generated-id';

    // Publish event
    this.eventBus.publish(new CustomerAddedEvent(customerId, name, email));

    return { id: customerId, name, email };
  }
}
