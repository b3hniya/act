import dagre from 'dagre';
import type { FlowNode, FlowEdge } from './types.js';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;

export interface LayoutOptions {
  direction: 'TB' | 'LR' | 'BT' | 'RL';
  nodeSpacing: number;
  rankSpacing: number;
}

const defaultOptions: LayoutOptions = {
  direction: 'TB',
  nodeSpacing: 50,
  rankSpacing: 100,
};

/**
 * Apply dagre layout to position nodes automatically
 */
export function applyDagreLayout(
  nodes: FlowNode[],
  edges: FlowEdge[],
  options: Partial<LayoutOptions> = {},
): FlowNode[] {
  const opts = { ...defaultOptions, ...options };

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: opts.direction,
    nodesep: opts.nodeSpacing,
    ranksep: opts.rankSpacing,
    marginx: 50,
    marginy: 50,
  });

  // Add nodes to dagre
  for (const node of nodes) {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }

  // Add edges to dagre
  for (const edge of edges) {
    dagreGraph.setEdge(edge.source, edge.target);
  }

  // Run layout algorithm
  dagre.layout(dagreGraph);

  // Apply positions to nodes
  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    };
  });
}
