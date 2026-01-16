import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

interface QueryNodeData {
  label: string;
  module: string;
}

function QueryNode({ data, selected }: NodeProps) {
  const nodeData = data as QueryNodeData;

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className={`custom-node query-node ${selected ? 'selected' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className="node-icon">❓</span>
          <span className="node-label">{nodeData.label}</span>
        </div>
        <div className="node-module">{nodeData.module}</div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}

export default memo(QueryNode);
