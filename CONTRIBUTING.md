# Contributing

## Development Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Build all packages:

   ```bash
   pnpm build
   ```

3. Start development:
   ```bash
   pnpm dev:api      # API server
   pnpm dev:dashboard # Dashboard
   ```

## Branch Naming

Use the following prefixes:

- `feat/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `chore/` - Maintenance tasks

Example: `feat/add-customer-search`

## Commit Messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Commits are validated by commitlint.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Allowed Types

| Type       | Description                     |
| ---------- | ------------------------------- |
| `feat`     | New feature                     |
| `fix`      | Bug fix                         |
| `docs`     | Documentation changes           |
| `style`    | Code style changes (formatting) |
| `refactor` | Code refactoring                |
| `perf`     | Performance improvements        |
| `test`     | Adding or updating tests        |
| `chore`    | Maintenance tasks               |
| `revert`   | Reverting commits               |
| `build`    | Build system changes            |
| `ci`       | CI/CD changes                   |

### Examples

```bash
feat(customer): add search functionality
fix(api): resolve null pointer in customer service
chore(deps): update typescript to 5.9
docs: update README with setup instructions
```

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Run tests: `pnpm test`
4. Run linting: `pnpm lint`
5. Run type checking: `pnpm typecheck`
6. Create a changeset if needed: `pnpm changeset`
7. Push and create a PR
8. Wait for CI checks to pass
9. Request review

## Code Style

- **Prettier** handles formatting automatically
- **ESLint** enforces code quality rules
- Pre-commit hooks run automatically via Husky

Run manually:

```bash
pnpm format  # Format all files
pnpm lint    # Check linting
```

## Testing

Write tests for new features and bug fixes.

```bash
pnpm test              # Run all tests
pnpm test -- --watch   # Watch mode
```

Coverage reports are uploaded to Codecov on CI.

## Adding New Packages

### Dependency Guidelines

Do not reinstall packages that are already in the root `package.json`. Shared devDependencies (TypeScript, ESLint, Prettier, Jest, etc.) are hoisted to the root and available to all packages. Only add package-specific dependencies that are unique to that package.

### New App

1. Create folder in `apps/`
2. Add `package.json` with name `@act/<app-name>` (e.g., `@act/dashboard`)
3. Add `tsconfig.json` extending root config
4. Add `eslint.config.js` extending base config
5. Add `README.md`

### New Module

1. Create folder in `modules/`
2. Add `package.json` with name `@act/<module-name>` (e.g., `@act/customer`)
3. Follow the same structure as `modules/customer/`:
   - `api/` - Controller, service, module definition
   - `application/command/` - CQRS commands and handlers
   - `application/query/` - CQRS queries and handlers
   - `application/event-handler/` - Domain event handlers
   - `repository/` - Data access layer
4. Export from `index.ts`
5. Add `README.md`

### New Library

1. Create folder in `libs/`
2. Add `package.json` with name `@act/<lib-name>` (e.g., `@act/database`)
3. Add `tsconfig.json`
4. Add `README.md`

## Documentation Guidelines

### Module READMEs

Module READMEs should focus on **business domain**, not technical implementation.

**Include:**

- Module purpose and responsibilities
- Domain concepts and entities
- Business rules
- API endpoints (user-facing description)
- Events (listens to / emits)
- Related modules

**Do NOT include:**

- Peer dependencies
- Folder structure
- Development commands
- Code examples for importing
- Technical setup instructions

Technical implementation details belong in `.cursorrules` and this file.

## Code Patterns Reference

For detailed code examples and patterns, see `.cursorrules`. Quick reference:

| Task              | Location                                          | Pattern                                            |
| ----------------- | ------------------------------------------------- | -------------------------------------------------- |
| Add controller    | `modules/<mod>/api/`                              | `@Controller` with CommandBus/QueryBus             |
| Add endpoint      | Existing controller                               | `@Get/@Post/@Put/@Delete` + command/query          |
| Add service       | `modules/<mod>/api/`                              | `@Injectable` Facade/ACL for external integrations |
| Add command       | `modules/<mod>/application/command/<name>/`       | Command class + `@CommandHandler`                  |
| Add query         | `modules/<mod>/application/query/<name>/`         | Query class + `@QueryHandler`                      |
| Add event handler | `modules/<mod>/application/event-handler/<name>/` | `@EventsHandler` class                             |
| Add repository    | `modules/<mod>/repository/`                       | `@Injectable` with CRUD methods                    |
| Add type/schema   | `libs/types/<domain>/`                            | Zod schema + inferred type                         |
| Add unit test     | Same folder as source                             | `*.spec.ts` with Jest                              |
