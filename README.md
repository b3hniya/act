# Act

A TypeScript monorepo for building scalable applications with NestJS and React.

## Prerequisites

- Node.js 22+
- pnpm 9.15+

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd act

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Start the API server
pnpm dev:api

# Start the dashboard (in another terminal)
pnpm dev:dashboard
```

## Monorepo Structure

```
act/
├── apps/
│   ├── api-server/     # NestJS API application
│   └── dashboard/      # React Vite frontend
├── modules/
│   └── customer/       # Customer domain module
├── libs/
│   ├── types/          # Shared TypeScript types
│   ├── components/     # Shared UI components
│   ├── database/       # Database utilities
│   └── events/         # Event definitions
└── scripts/            # Build and utility scripts
```

## Available Scripts

| Script               | Description                         |
| -------------------- | ----------------------------------- |
| `pnpm build`         | Build all packages                  |
| `pnpm dev`           | Start all apps in development mode  |
| `pnpm dev:api`       | Start API server in dev mode        |
| `pnpm dev:dashboard` | Start dashboard in dev mode         |
| `pnpm start:api`     | Start API server in production mode |
| `pnpm test`          | Run all tests                       |
| `pnpm lint`          | Lint all packages                   |
| `pnpm format`        | Format all files with Prettier      |
| `pnpm typecheck`     | Run TypeScript type checking        |
| `pnpm clean`         | Clean all build artifacts           |
| `pnpm changeset`     | Create a changeset for versioning   |
| `pnpm version`       | Update versions based on changesets |
| `pnpm release`       | Build and publish packages          |

## Package Documentation

- [API Server](apps/api-server/README.md)
- [Dashboard](apps/dashboard/README.md)
- [Customer Module](modules/customer/README.md)
- [Types Library](libs/types/README.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.
