import { z } from 'zod';

export const invoiceSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.number(),
  date: z.string(),
  status: z.string(),
});

export type Invoice = z.infer<typeof invoiceSchema>;
