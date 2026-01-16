# Types

Shared TypeScript types and Zod schemas for the Act platform.

## Installation

```typescript
import { Customer, Invoice } from '@act/types';
```

## Available Types

### Customer

```typescript
import { Customer, customerSchema } from '@act/types';

// Type
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

// Zod schema for validation
const result = customerSchema.parse(data);
```

### Invoice

```typescript
import { Invoice, invoiceSchema } from '@act/types';

// Type
interface Invoice {
  id: string;
  customerId: string;
  amount: number;
  date: string;
  status: string;
}

// Zod schema for validation
const result = invoiceSchema.parse(data);
```

## Usage with Zod

All types include Zod schemas for runtime validation:

```typescript
import { customerSchema } from '@act/types';

// Validate data
const customer = customerSchema.parse(unknownData);

// Safe parse (doesn't throw)
const result = customerSchema.safeParse(unknownData);
if (result.success) {
  console.log(result.data);
} else {
  console.log(result.error);
}
```

## Development

```bash
cd libs/types

# Build
pnpm build

# Type check
pnpm typecheck
```

## Adding New Types

1. Create a new folder under `libs/types/` (e.g., `product/`)
2. Add type file with Zod schema:

```typescript
// libs/types/product/product.type.ts
import { z } from 'zod';

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
});

export type Product = z.infer<typeof productSchema>;
```

3. Export from index:

```typescript
// libs/types/product/index.ts
export * from './product.type';

// libs/types/index.ts
export * from './product';
```
