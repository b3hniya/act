import { scanModules, getModuleName } from './scanner.js';
import { parseFile } from './parser.js';
import type { AnalysisResult, GraphNode, GraphEdge, ParsedFile } from './types.js';

export * from './types.js';
export { scanModules } from './scanner.js';
export { parseFile } from './parser.js';

/**
 * Main entry point: analyze the entire modules directory
 */
export async function analyze(rootPath: string): Promise<AnalysisResult> {
  const { files, modulesPath } = await scanModules(rootPath);

  const allParsed: Array<{ file: string; module: string; parsed: ParsedFile }> = [];

  // Parse all files
  for (const file of files) {
    const moduleName = getModuleName(file, modulesPath);
    const parsed = parseFile(file, moduleName);
    allParsed.push({ file, module: moduleName, parsed });
  }

  // Collect all unique commands, queries, events
  const allCommands = new Set<string>();
  const allQueries = new Set<string>();
  const allEvents = new Set<string>();

  for (const { parsed } of allParsed) {
    parsed.commands.forEach((c) => allCommands.add(c));
    parsed.queries.forEach((q) => allQueries.add(q));
    parsed.events.forEach((e) => allEvents.add(e));

    // Also collect from handlers
    parsed.commandHandlers.forEach((h) => allCommands.add(h.handlesCommand));
    parsed.queryHandlers.forEach((h) => allQueries.add(h.handlesQuery));
    parsed.eventHandlers.forEach((h) => allEvents.add(h.listensToEvent));

    // Collect dispatched items
    parsed.controllers.forEach((c) => {
      c.methods.forEach((m) => {
        m.dispatches.forEach((d) => {
          if (d.endsWith('Command')) allCommands.add(d);
          if (d.endsWith('Query')) allQueries.add(d);
        });
      });
    });

    // Collect published events
    parsed.commandHandlers.forEach((h) => {
      h.publishesEvents.forEach((e) => allEvents.add(e));
    });

    // Collect dispatched commands from event handlers
    parsed.eventHandlers.forEach((h) => {
      h.dispatchesCommands.forEach((c) => allCommands.add(c));
    });
  }

  // Build nodes and edges
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // Create nodes for commands
  for (const command of allCommands) {
    if (command) {
      nodes.push({
        id: `cmd-${command}`,
        type: 'command',
        label: command,
        module: findModuleForClass(allParsed, command) || 'unknown',
        file: '',
        metadata: {},
      });
    }
  }

  // Create nodes for queries
  for (const query of allQueries) {
    if (query) {
      nodes.push({
        id: `qry-${query}`,
        type: 'query',
        label: query,
        module: findModuleForClass(allParsed, query) || 'unknown',
        file: '',
        metadata: {},
      });
    }
  }

  // Create nodes for events
  for (const event of allEvents) {
    if (event) {
      nodes.push({
        id: `evt-${event}`,
        type: 'event',
        label: event,
        module: findModuleForClass(allParsed, event) || 'unknown',
        file: '',
        metadata: {},
      });
    }
  }

  // Process all parsed files for handlers and controllers
  for (const { parsed } of allParsed) {
    // Controllers
    for (const ctrl of parsed.controllers) {
      const nodeId = `ctrl-${ctrl.name}`;
      nodes.push({
        id: nodeId,
        type: 'controller',
        label: ctrl.name,
        module: ctrl.module,
        file: ctrl.file,
        metadata: {
          route: ctrl.route,
          methods: ctrl.methods,
        },
      });

      // Edges from controller to commands/queries
      for (const method of ctrl.methods) {
        for (const dispatched of method.dispatches) {
          if (dispatched.endsWith('Command')) {
            edges.push({
              id: `${nodeId}-cmd-${dispatched}`,
              source: nodeId,
              target: `cmd-${dispatched}`,
              label: 'dispatches',
            });
          } else if (dispatched.endsWith('Query')) {
            edges.push({
              id: `${nodeId}-qry-${dispatched}`,
              source: nodeId,
              target: `qry-${dispatched}`,
              label: 'dispatches',
            });
          }
        }
      }
    }

    // Command Handlers
    for (const handler of parsed.commandHandlers) {
      const nodeId = `cmdh-${handler.name}`;
      nodes.push({
        id: nodeId,
        type: 'commandHandler',
        label: handler.name,
        module: handler.module,
        file: handler.file,
        metadata: {
          handlesCommand: handler.handlesCommand,
          publishesEvents: handler.publishesEvents,
        },
      });

      // Edge from command to handler
      if (handler.handlesCommand) {
        edges.push({
          id: `cmd-${handler.handlesCommand}-${nodeId}`,
          source: `cmd-${handler.handlesCommand}`,
          target: nodeId,
          label: 'handles',
        });
      }

      // Edges from handler to published events
      for (const event of handler.publishesEvents) {
        edges.push({
          id: `${nodeId}-evt-${event}`,
          source: nodeId,
          target: `evt-${event}`,
          label: 'publishes',
        });
      }
    }

    // Query Handlers
    for (const handler of parsed.queryHandlers) {
      const nodeId = `qryh-${handler.name}`;
      nodes.push({
        id: nodeId,
        type: 'queryHandler',
        label: handler.name,
        module: handler.module,
        file: handler.file,
        metadata: {
          handlesQuery: handler.handlesQuery,
        },
      });

      // Edge from query to handler
      if (handler.handlesQuery) {
        edges.push({
          id: `qry-${handler.handlesQuery}-${nodeId}`,
          source: `qry-${handler.handlesQuery}`,
          target: nodeId,
          label: 'handles',
        });
      }
    }

    // Event Handlers
    for (const handler of parsed.eventHandlers) {
      const nodeId = `evth-${handler.name}`;
      nodes.push({
        id: nodeId,
        type: 'eventHandler',
        label: handler.name,
        module: handler.module,
        file: handler.file,
        metadata: {
          listensToEvent: handler.listensToEvent,
          dispatchesCommands: handler.dispatchesCommands,
        },
      });

      // Edge from event to handler
      if (handler.listensToEvent) {
        edges.push({
          id: `evt-${handler.listensToEvent}-${nodeId}`,
          source: `evt-${handler.listensToEvent}`,
          target: nodeId,
          label: 'listens',
        });
      }

      // Edges from handler to dispatched commands
      for (const command of handler.dispatchesCommands) {
        edges.push({
          id: `${nodeId}-cmd-${command}`,
          source: nodeId,
          target: `cmd-${command}`,
          label: 'triggers',
        });
      }
    }
  }

  // Calculate stats
  const stats = {
    controllers: nodes.filter((n) => n.type === 'controller').length,
    commands: nodes.filter((n) => n.type === 'command').length,
    queries: nodes.filter((n) => n.type === 'query').length,
    events: nodes.filter((n) => n.type === 'event').length,
    commandHandlers: nodes.filter((n) => n.type === 'commandHandler').length,
    queryHandlers: nodes.filter((n) => n.type === 'queryHandler').length,
    eventHandlers: nodes.filter((n) => n.type === 'eventHandler').length,
  };

  return { nodes, edges, stats };
}

function findModuleForClass(
  allParsed: Array<{ file: string; module: string; parsed: ParsedFile }>,
  className: string,
): string | undefined {
  for (const { module, parsed } of allParsed) {
    if (
      parsed.commands.includes(className) ||
      parsed.queries.includes(className) ||
      parsed.events.includes(className)
    ) {
      return module;
    }
  }
  return undefined;
}
