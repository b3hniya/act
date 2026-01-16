import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE, customers, eq } from '@act/database';
import type { DrizzleDB } from '@act/database';
import type { Customer } from '@act/types';

@Injectable()
export class CustomerRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  /**
   * Find all customers
   */
  async findAll(): Promise<Customer[]> {
    const result = await this.db.select().from(customers);
    return result.map(this.mapToCustomer);
  }

  /**
   * Find a customer by ID
   */
  async findById(id: string): Promise<Customer | null> {
    const result = await this.db.select().from(customers).where(eq(customers.id, id));
    return result[0] ? this.mapToCustomer(result[0]) : null;
  }

  /**
   * Find a customer by email
   */
  async findByEmail(email: string): Promise<Customer | null> {
    const result = await this.db.select().from(customers).where(eq(customers.email, email));
    return result[0] ? this.mapToCustomer(result[0]) : null;
  }

  /**
   * Create a new customer
   */
  async create(data: Omit<Customer, 'id'>): Promise<Customer> {
    const result = await this.db.insert(customers).values(data).returning();
    return this.mapToCustomer(result[0]);
  }

  /**
   * Update a customer by ID
   */
  async update(id: string, data: Partial<Omit<Customer, 'id'>>): Promise<Customer | null> {
    const result = await this.db
      .update(customers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(customers.id, id))
      .returning();
    return result[0] ? this.mapToCustomer(result[0]) : null;
  }

  /**
   * Delete a customer by ID
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.db.delete(customers).where(eq(customers.id, id)).returning();
    return result.length > 0;
  }

  /**
   * Check if a customer exists by email
   */
  async existsByEmail(email: string): Promise<boolean> {
    const result = await this.db
      .select({ id: customers.id })
      .from(customers)
      .where(eq(customers.email, email));
    return result.length > 0;
  }

  /**
   * Map database row to Customer type
   */
  private mapToCustomer(row: typeof customers.$inferSelect): Customer {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone ?? '',
      address: row.address ?? '',
      city: row.city ?? '',
      state: row.state ?? '',
      zip: row.zip ?? '',
    };
  }
}
