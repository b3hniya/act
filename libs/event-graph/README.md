# @act/event-graph

A visual tool that automatically detects and visualizes CQRS event flows in NestJS applications.

## Overview

Event Graph statically analyzes your codebase to find:

- **Controllers** and their dispatched commands/queries
- **Command Handlers** and their published events
- **Query Handlers**
- **Event Handlers** and their triggered commands

It then renders an interactive graph showing how these components connect.

## Usage

From the project root:

```bash
pnpm run event-graph
```

This will:

1. Scan the `modules/` directory for TypeScript files
2. Analyze CQRS patterns using the TypeScript Compiler API
3. Start a local web server at http://localhost:4200
4. Open your browser with the interactive visualization

## Features

- **Automatic Detection**: No manual configuration needed - patterns are detected from code
- **Interactive Graph**: Zoom, pan, and click nodes for details
- **Live Refresh**: Click "Refresh" to re-analyze after code changes
- **Node Types**:
  - 🎮 Controller (blue)
  - ⚡ Command (green)
  - ❓ Query (purple)
  - 📢 Event (orange)
  - 👂 Handler (teal)

## Detected Patterns

### Controllers

```typescript
@Controller('customer')
export class CustomerController {
  @Post()
  create() {
    return this.commandBus.execute(new AddCustomerCommand(...));
  }
}
```

### Command Handlers

```typescript
@CommandHandler(AddCustomerCommand)
export class AddCustomerHandler {
  async execute(command: AddCustomerCommand) {
    this.eventBus.publish(new CustomerAddedEvent(...));
  }
}
```

### Event Handlers

```typescript
@EventsHandler(CustomerAddedEvent)
export class OnCustomerAddedHandler {
  handle(event: CustomerAddedEvent) {
    this.commandBus.execute(new SendWelcomeEmailCommand(...));
  }
}
```

## Architecture

```
src/
├── analyzer/       # Static analysis using TypeScript Compiler API
├── graph/          # Graph building and layout (dagre)
├── server/         # Express API server
├── web/            # React visualization (ReactFlow)
└── cli.ts          # CLI entry point
```

## Dependencies

- `@xyflow/react` - Graph visualization
- `dagre` - Auto-layout algorithm
- `express` - API server
- `typescript` - AST parsing
