export class InvoiceAddedEvent {
  constructor(
    public readonly invoiceId: string,
    public readonly customerId: string,
    public readonly amount: number,
  ) {}
}
