export type NodeType =
  | 'controller'
  | 'command'
  | 'query'
  | 'event'
  | 'commandHandler'
  | 'queryHandler'
  | 'eventHandler';

export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  module: string;
  file: string;
  metadata: {
    route?: string;
    methods?: MethodInfo[];
    handlesCommand?: string;
    handlesQuery?: string;
    listensToEvent?: string;
    publishesEvents?: string[];
    dispatchesCommands?: string[];
  };
}

export interface MethodInfo {
  name: string;
  httpMethod: string;
  route: string;
  dispatches: string[];
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: EdgeLabel;
}

export type EdgeLabel = 'dispatches' | 'handles' | 'publishes' | 'listens' | 'triggers';

export interface AnalysisResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
  stats: {
    controllers: number;
    commands: number;
    queries: number;
    events: number;
    commandHandlers: number;
    queryHandlers: number;
    eventHandlers: number;
  };
}

export interface ParsedController {
  name: string;
  route: string;
  file: string;
  module: string;
  methods: MethodInfo[];
}

export interface ParsedCommandHandler {
  name: string;
  handlesCommand: string;
  file: string;
  module: string;
  publishesEvents: string[];
}

export interface ParsedQueryHandler {
  name: string;
  handlesQuery: string;
  file: string;
  module: string;
}

export interface ParsedEventHandler {
  name: string;
  listensToEvent: string;
  file: string;
  module: string;
  dispatchesCommands: string[];
}

export interface ParsedFile {
  controllers: ParsedController[];
  commandHandlers: ParsedCommandHandler[];
  queryHandlers: ParsedQueryHandler[];
  eventHandlers: ParsedEventHandler[];
  commands: string[];
  queries: string[];
  events: string[];
}
