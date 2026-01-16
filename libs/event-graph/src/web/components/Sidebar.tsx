import type { FlowNode } from '../../graph/types';

interface SidebarProps {
  node: FlowNode | null;
  onClose: () => void;
}

export function Sidebar({ node, onClose }: SidebarProps) {
  if (!node) return null;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'controller':
        return '🎮 Controller';
      case 'command':
        return '⚡ Command';
      case 'query':
        return '❓ Query';
      case 'event':
        return '📢 Event';
      case 'commandHandler':
        return '⚙️ Command Handler';
      case 'queryHandler':
        return '🔍 Query Handler';
      case 'eventHandler':
        return '👂 Event Handler';
      default:
        return type;
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">Node Details</span>
        <button className="sidebar-close" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">Type</div>
        <div className="sidebar-value">{getTypeLabel(node.data.nodeType)}</div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">Name</div>
        <div className="sidebar-value">{node.data.label}</div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">Module</div>
        <div className="sidebar-value">{node.data.module || 'N/A'}</div>
      </div>

      {node.data.file && (
        <div className="sidebar-section">
          <div className="sidebar-label">File</div>
          <div className="sidebar-value" style={{ fontSize: '11px', wordBreak: 'break-all' }}>
            {node.data.file}
          </div>
        </div>
      )}

      {node.data.metadata?.route && (
        <div className="sidebar-section">
          <div className="sidebar-label">Route</div>
          <div className="sidebar-value">{node.data.metadata.route as string}</div>
        </div>
      )}

      {node.data.metadata?.handlesCommand && (
        <div className="sidebar-section">
          <div className="sidebar-label">Handles Command</div>
          <div className="sidebar-value">{node.data.metadata.handlesCommand as string}</div>
        </div>
      )}

      {node.data.metadata?.handlesQuery && (
        <div className="sidebar-section">
          <div className="sidebar-label">Handles Query</div>
          <div className="sidebar-value">{node.data.metadata.handlesQuery as string}</div>
        </div>
      )}

      {node.data.metadata?.listensToEvent && (
        <div className="sidebar-section">
          <div className="sidebar-label">Listens To</div>
          <div className="sidebar-value">{node.data.metadata.listensToEvent as string}</div>
        </div>
      )}

      {node.data.metadata?.publishesEvents &&
        (node.data.metadata.publishesEvents as string[]).length > 0 && (
          <div className="sidebar-section">
            <div className="sidebar-label">Publishes Events</div>
            {(node.data.metadata.publishesEvents as string[]).map((event, i) => (
              <div key={i} className="sidebar-value" style={{ marginTop: 4 }}>
                • {event}
              </div>
            ))}
          </div>
        )}

      {node.data.metadata?.dispatchesCommands &&
        (node.data.metadata.dispatchesCommands as string[]).length > 0 && (
          <div className="sidebar-section">
            <div className="sidebar-label">Dispatches Commands</div>
            {(node.data.metadata.dispatchesCommands as string[]).map((cmd, i) => (
              <div key={i} className="sidebar-value" style={{ marginTop: 4 }}>
                • {cmd}
              </div>
            ))}
          </div>
        )}

      {node.data.metadata?.methods &&
        (node.data.metadata.methods as Array<{ name: string; httpMethod: string; route: string }>)
          .length > 0 && (
          <div className="sidebar-section">
            <div className="sidebar-label">Methods</div>
            {(
              node.data.metadata.methods as Array<{
                name: string;
                httpMethod: string;
                route: string;
              }>
            ).map((method, i) => (
              <div key={i} className="sidebar-value" style={{ marginTop: 4, fontSize: '12px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: '#334155',
                    marginRight: '8px',
                    fontSize: '10px',
                  }}
                >
                  {method.httpMethod}
                </span>
                {method.name}
                {method.route && <span style={{ opacity: 0.6 }}> ({method.route})</span>}
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
