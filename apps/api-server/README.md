# API Server

NestJS backend application for the Act platform.

## Running Locally

```bash
# From monorepo root
pnpm dev:api

# Or directly
cd apps/api-server
pnpm dev
```

The server runs at `http://localhost:3000` by default.

## Scripts

| Script          | Description             |
| --------------- | ----------------------- |
| `pnpm dev`      | Start in watch mode     |
| `pnpm build`    | Build for production    |
| `pnpm start`    | Start production server |
| `pnpm test`     | Run unit tests          |
| `pnpm test:e2e` | Run e2e tests           |
| `pnpm test:cov` | Run tests with coverage |
| `pnpm lint`     | Lint code               |
| `pnpm format`   | Format code             |

## Environment Variables

| Variable | Description | Default |
| -------- | ----------- | ------- |
| `PORT`   | Server port | `3000`  |

## Registered Modules

- **CustomerModule** - Customer management endpoints

## API Endpoints

### Health Check

```
GET /
```

Returns a hello message.

### Customer

```
GET /customer
```

Returns list of customers.

## Adding New Modules

1. Create module in `modules/` directory
2. Import in `src/app.module.ts`:

```typescript
import { CustomerModule } from '@act/customer';
import { NewModule } from '@act/new-module';

@Module({
  imports: [CustomerModule, NewModule],
  // ...
})
export class AppModule {}
```

## Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# With coverage
pnpm test:cov
```
