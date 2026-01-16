import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

interface CommandNodeData {
  label: string;
  module: string;
}

function CommandNode({ data, selected }: NodeProps) {
  const nodeData = data as CommandNodeData;

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className={`custom-node command-node ${selected ? 'selected' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className="node-icon">⚡</span>
          <span className="node-label">{nodeData.label}</span>
        </div>
        <div className="node-module">{nodeData.module}</div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}

export default memo(CommandNode);
