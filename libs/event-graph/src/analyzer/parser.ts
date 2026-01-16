import * as ts from 'typescript';
import fs from 'fs';
import type {
  ParsedFile,
  ParsedController,
  ParsedCommandHandler,
  ParsedQueryHandler,
  ParsedEventHandler,
  MethodInfo,
} from './types.js';

/**
 * Parse a TypeScript file and extract CQRS patterns
 */
export function parseFile(filePath: string, moduleName: string): ParsedFile {
  const sourceCode = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(filePath, sourceCode, ts.ScriptTarget.Latest, true);

  const result: ParsedFile = {
    controllers: [],
    commandHandlers: [],
    queryHandlers: [],
    eventHandlers: [],
    commands: [],
    queries: [],
    events: [],
  };

  function visit(node: ts.Node) {
    if (ts.isClassDeclaration(node) && node.name) {
      const decorators = ts.getDecorators(node);
      if (decorators) {
        for (const decorator of decorators) {
          processClassDecorator(node, decorator, result, filePath, moduleName);
        }
      }
    }

    // Look for command/query/event class definitions (for standalone classes)
    if (ts.isClassDeclaration(node) && node.name) {
      const className = node.name.text;
      if (className.endsWith('Command') && !className.includes('Handler')) {
        result.commands.push(className);
      } else if (className.endsWith('Query') && !className.includes('Handler')) {
        result.queries.push(className);
      } else if (className.endsWith('Event') && !className.includes('Handler')) {
        result.events.push(className);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return result;
}

function processClassDecorator(
  classNode: ts.ClassDeclaration,
  decorator: ts.Decorator,
  result: ParsedFile,
  filePath: string,
  moduleName: string,
) {
  if (!ts.isCallExpression(decorator.expression)) return;

  const decoratorName = getDecoratorName(decorator.expression);
  const _className = classNode.name?.text || 'Unknown'; // Available for debugging

  switch (decoratorName) {
    case 'Controller':
      result.controllers.push(
        parseController(classNode, decorator.expression, filePath, moduleName),
      );
      break;
    case 'CommandHandler':
      result.commandHandlers.push(
        parseCommandHandler(classNode, decorator.expression, filePath, moduleName),
      );
      break;
    case 'QueryHandler':
      result.queryHandlers.push(
        parseQueryHandler(classNode, decorator.expression, filePath, moduleName),
      );
      break;
    case 'EventsHandler':
      result.eventHandlers.push(
        parseEventHandler(classNode, decorator.expression, filePath, moduleName),
      );
      break;
  }
}

function getDecoratorName(callExpr: ts.CallExpression): string {
  if (ts.isIdentifier(callExpr.expression)) {
    return callExpr.expression.text;
  }
  return '';
}

function parseController(
  classNode: ts.ClassDeclaration,
  decoratorExpr: ts.CallExpression,
  filePath: string,
  moduleName: string,
): ParsedController {
  const className = classNode.name?.text || 'Unknown';
  const route = getStringArgument(decoratorExpr, 0) || '';
  const methods = extractControllerMethods(classNode);

  return {
    name: className,
    route: '/' + route,
    file: filePath,
    module: moduleName,
    methods,
  };
}

function extractControllerMethods(classNode: ts.ClassDeclaration): MethodInfo[] {
  const methods: MethodInfo[] = [];

  for (const member of classNode.members) {
    if (ts.isMethodDeclaration(member) && member.name) {
      const methodName = ts.isIdentifier(member.name) ? member.name.text : 'unknown';
      const decorators = ts.getDecorators(member);

      let httpMethod = 'GET';
      let route = '';

      if (decorators) {
        for (const decorator of decorators) {
          if (ts.isCallExpression(decorator.expression)) {
            const name = getDecoratorName(decorator.expression);
            if (['Get', 'Post', 'Put', 'Delete', 'Patch'].includes(name)) {
              httpMethod = name.toUpperCase();
              route = getStringArgument(decorator.expression, 0) || '';
            }
          }
        }
      }

      // Find dispatched commands/queries in method body
      const dispatches = findDispatchedItems(member);

      if (dispatches.length > 0 || decorators?.length) {
        methods.push({
          name: methodName,
          httpMethod,
          route,
          dispatches,
        });
      }
    }
  }

  return methods;
}

function findDispatchedItems(node: ts.Node): string[] {
  const dispatches: string[] = [];

  function visit(n: ts.Node) {
    if (ts.isCallExpression(n)) {
      const callText = n.getText();
      // Look for commandBus.execute(new XxxCommand) or queryBus.execute(new XxxQuery)
      if (
        callText.includes('.execute(') &&
        (callText.includes('commandBus') || callText.includes('queryBus'))
      ) {
        // Extract the class name from new ClassName(...)
        const match = callText.match(/new\s+(\w+)/);
        if (match) {
          dispatches.push(match[1]);
        }
      }
    }
    ts.forEachChild(n, visit);
  }

  visit(node);
  return dispatches;
}

function parseCommandHandler(
  classNode: ts.ClassDeclaration,
  decoratorExpr: ts.CallExpression,
  filePath: string,
  moduleName: string,
): ParsedCommandHandler {
  const className = classNode.name?.text || 'Unknown';
  const handlesCommand = getIdentifierArgument(decoratorExpr, 0) || '';
  const publishesEvents = findPublishedEvents(classNode);

  return {
    name: className,
    handlesCommand,
    file: filePath,
    module: moduleName,
    publishesEvents,
  };
}

function findPublishedEvents(classNode: ts.ClassDeclaration): string[] {
  const events: string[] = [];

  function visit(node: ts.Node) {
    if (ts.isCallExpression(node)) {
      const callText = node.getText();
      // Look for eventBus.publish(new XxxEvent)
      if (callText.includes('.publish(') || callText.includes('.apply(')) {
        const match = callText.match(/new\s+(\w+Event)/);
        if (match) {
          events.push(match[1]);
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(classNode);
  return events;
}

function parseQueryHandler(
  classNode: ts.ClassDeclaration,
  decoratorExpr: ts.CallExpression,
  filePath: string,
  moduleName: string,
): ParsedQueryHandler {
  const className = classNode.name?.text || 'Unknown';
  const handlesQuery = getIdentifierArgument(decoratorExpr, 0) || '';

  return {
    name: className,
    handlesQuery,
    file: filePath,
    module: moduleName,
  };
}

function parseEventHandler(
  classNode: ts.ClassDeclaration,
  decoratorExpr: ts.CallExpression,
  filePath: string,
  moduleName: string,
): ParsedEventHandler {
  const className = classNode.name?.text || 'Unknown';
  const listensToEvent = getIdentifierArgument(decoratorExpr, 0) || '';
  const dispatchesCommands = findDispatchedCommands(classNode);

  return {
    name: className,
    listensToEvent,
    file: filePath,
    module: moduleName,
    dispatchesCommands,
  };
}

function findDispatchedCommands(classNode: ts.ClassDeclaration): string[] {
  const commands: string[] = [];

  function visit(node: ts.Node) {
    if (ts.isCallExpression(node)) {
      const callText = node.getText();
      // Look for commandBus.execute(new XxxCommand)
      if (callText.includes('commandBus') && callText.includes('.execute(')) {
        const match = callText.match(/new\s+(\w+Command)/);
        if (match) {
          commands.push(match[1]);
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(classNode);
  return commands;
}

function getStringArgument(callExpr: ts.CallExpression, index: number): string | undefined {
  const arg = callExpr.arguments[index];
  if (arg && ts.isStringLiteral(arg)) {
    return arg.text;
  }
  return undefined;
}

function getIdentifierArgument(callExpr: ts.CallExpression, index: number): string | undefined {
  const arg = callExpr.arguments[index];
  if (arg && ts.isIdentifier(arg)) {
    return arg.text;
  }
  return undefined;
}
