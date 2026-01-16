import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

interface HandlerNodeData {
  label: string;
  module: string;
  nodeType: string;
}

function HandlerNode({ data, selected }: NodeProps) {
  const nodeData = data as HandlerNodeData;

  const getIcon = () => {
    switch (nodeData.nodeType) {
      case 'commandHandler':
        return '⚙️';
      case 'queryHandler':
        return '🔍';
      case 'eventHandler':
        return '👂';
      default:
        return '📦';
    }
  };

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className={`custom-node handler-node ${selected ? 'selected' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className="node-icon">{getIcon()}</span>
          <span className="node-label">{nodeData.label}</span>
        </div>
        <div className="node-module">{nodeData.module}</div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}

export default memo(HandlerNode);
