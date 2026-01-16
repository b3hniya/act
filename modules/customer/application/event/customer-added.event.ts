export class CustomerAddedEvent {
  constructor(
    public readonly customerId: string,
    public readonly name: string,
    public readonly email: string,
  ) {}
}
