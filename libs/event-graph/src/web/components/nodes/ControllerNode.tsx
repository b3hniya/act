import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

interface ControllerNodeData {
  label: string;
  module: string;
  metadata: {
    route?: string;
  };
}

function ControllerNode({ data, selected }: NodeProps) {
  const nodeData = data as ControllerNodeData;

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className={`custom-node controller-node ${selected ? 'selected' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className="node-icon">🎮</span>
          <span className="node-label">{nodeData.label}</span>
        </div>
        {nodeData.metadata?.route && <div className="node-module">{nodeData.metadata.route}</div>}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}

export default memo(ControllerNode);
