import type { AnalysisResult, NodeType } from '../analyzer/types.js';
import type { FlowNode, FlowEdge, FlowGraphData } from './types.js';
import { applyDagreLayout, type LayoutOptions } from './layout.js';
import { MarkerType } from '@xyflow/react';

/**
 * Convert analysis result to ReactFlow format with layout applied
 */
export function buildFlowGraph(
  analysis: AnalysisResult,
  layoutOptions?: Partial<LayoutOptions>,
): FlowGraphData {
  const flowNodes: FlowNode[] = analysis.nodes.map((node) => ({
    id: node.id,
    type: mapNodeTypeToFlowType(node.type),
    position: { x: 0, y: 0 }, // Will be set by layout
    data: {
      label: node.label,
      nodeType: node.type,
      module: node.module,
      file: node.file,
      metadata: node.metadata,
    },
  }));

  const flowEdges: FlowEdge[] = analysis.edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    type: 'smoothstep',
    animated: edge.label === 'publishes' || edge.label === 'listens',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
    },
    style: getEdgeStyle(edge.label),
    data: {
      label: edge.label,
    },
  }));

  // Apply dagre layout
  const layoutedNodes = applyDagreLayout(flowNodes, flowEdges, layoutOptions);

  return {
    nodes: layoutedNodes,
    edges: flowEdges,
  };
}

function mapNodeTypeToFlowType(nodeType: NodeType): string {
  switch (nodeType) {
    case 'controller':
      return 'controllerNode';
    case 'command':
      return 'commandNode';
    case 'query':
      return 'queryNode';
    case 'event':
      return 'eventNode';
    case 'commandHandler':
    case 'queryHandler':
    case 'eventHandler':
      return 'handlerNode';
    default:
      return 'default';
  }
}

function getEdgeStyle(label: string): React.CSSProperties {
  const baseStyle: React.CSSProperties = {
    strokeWidth: 2,
  };

  switch (label) {
    case 'dispatches':
      return { ...baseStyle, stroke: '#3B82F6' }; // Blue
    case 'handles':
      return { ...baseStyle, stroke: '#22C55E' }; // Green
    case 'publishes':
      return { ...baseStyle, stroke: '#F97316' }; // Orange
    case 'listens':
      return { ...baseStyle, stroke: '#14B8A6' }; // Teal
    case 'triggers':
      return { ...baseStyle, stroke: '#A855F7' }; // Purple
    default:
      return { ...baseStyle, stroke: '#6B7280' }; // Gray
  }
}
