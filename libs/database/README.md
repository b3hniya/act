# @act/database

Shared database layer for the Act monorepo using Drizzle ORM with PostgreSQL.

## Purpose

Provides centralized database access with domain-isolated schemas. Each business domain (customer, invoice, etc.) has its own PostgreSQL schema for data isolation and organization.

## Domain Schemas

| Domain   | PostgreSQL Schema | Tables      |
| -------- | ----------------- | ----------- |
| Customer | `customer`        | `customers` |
| Invoice  | `invoice`         | `invoices`  |

## Usage

Import the database module in your NestJS modules:

```typescript
import { DatabaseModule } from '@act/database';

@Module({
  imports: [DatabaseModule],
})
export class YourModule {}
```

Inject in repositories:

```typescript
import { DRIZZLE, customers, eq } from '@act/database';
import type { DrizzleDB } from '@act/database';

@Injectable()
export class CustomerRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}
}
```

## Environment

Requires `DATABASE_URL` environment variable:

```
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

## Commands

| Command                                   | Description             |
| ----------------------------------------- | ----------------------- |
| `pnpm --filter @act/database db:generate` | Generate migrations     |
| `pnpm --filter @act/database db:migrate`  | Run migrations          |
| `pnpm --filter @act/database db:push`     | Push schema to database |
| `pnpm --filter @act/database db:studio`   | Open Drizzle Studio     |
