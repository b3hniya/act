import type { Node, Edge } from '@xyflow/react';

export interface FlowNode extends Node {
  data: {
    label: string;
    nodeType: string;
    module: string;
    file: string;
    metadata: Record<string, unknown>;
  };
}

export interface FlowEdge extends Edge {
  data?: {
    label: string;
  };
}

export interface FlowGraphData {
  nodes: FlowNode[];
  edges: FlowEdge[];
}
