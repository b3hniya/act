import { useCallback, useState } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  type OnSelectionChangeParams,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { nodeTypes } from './nodes';
import { Sidebar } from './Sidebar';
import { Legend } from './Legend';
import { Header } from './Header';
import type { FlowNode, FlowEdge } from '../../graph/types';

interface FlowGraphProps {
  nodes: FlowNode[];
  edges: FlowEdge[];
  stats: {
    controllers: number;
    commands: number;
    queries: number;
    events: number;
    commandHandlers: number;
    queryHandlers: number;
    eventHandlers: number;
  };
  onRefresh: () => void;
}

export function FlowGraph({
  nodes: initialNodes,
  edges: initialEdges,
  stats,
  onRefresh,
}: FlowGraphProps) {
  const [nodes, _setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, _setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);

  const onSelectionChange = useCallback(({ nodes }: OnSelectionChangeParams) => {
    if (nodes.length === 1) {
      setSelectedNode(nodes[0] as FlowNode);
    } else {
      setSelectedNode(null);
    }
  }, []);

  const getMiniMapNodeColor = (node: FlowNode) => {
    switch (node.data?.nodeType) {
      case 'controller':
        return '#3B82F6';
      case 'command':
        return '#22C55E';
      case 'query':
        return '#A855F7';
      case 'event':
        return '#F97316';
      case 'commandHandler':
      case 'queryHandler':
      case 'eventHandler':
        return '#14B8A6';
      default:
        return '#6B7280';
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Header stats={stats} onRefresh={onRefresh} />

      <div
        style={{
          width: '100%',
          height: 'calc(100% - 60px)',
          marginTop: '60px',
          marginRight: selectedNode ? '320px' : '0',
          transition: 'margin-right 0.3s ease',
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onSelectionChange={onSelectionChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.1}
          maxZoom={2}
          defaultEdgeOptions={{
            type: 'smoothstep',
          }}
        >
          <Controls />
          <MiniMap nodeColor={getMiniMapNodeColor} nodeStrokeWidth={3} zoomable pannable />
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#334155" />
        </ReactFlow>
      </div>

      <Legend />
      <Sidebar node={selectedNode} onClose={() => setSelectedNode(null)} />
    </div>
  );
}
