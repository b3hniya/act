import { EventsHandler, IEventHandler, CommandBus } from '@nestjs/cqrs';
import { InvoiceAddedEvent } from '@act/events';

@EventsHandler(InvoiceAddedEvent)
export class OnInvoiceAddedChangeCustomerDueHandler implements IEventHandler<InvoiceAddedEvent> {
  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: InvoiceAddedEvent) {
    const { invoiceId, customerId, amount } = event;
    // Event handlers should dispatch commands, not directly modify database
    // Example: await this.commandBus.execute(new UpdateCustomerDueCommand(customerId, amount));
    console.log(`Invoice ${invoiceId} added for customer ${customerId}: $${amount}`);
  }
}
