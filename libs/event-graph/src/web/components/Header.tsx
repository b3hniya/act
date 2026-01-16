interface Stats {
  controllers: number;
  commands: number;
  queries: number;
  events: number;
  commandHandlers: number;
  queryHandlers: number;
  eventHandlers: number;
}

interface HeaderProps {
  stats: Stats;
  onRefresh: () => void;
}

function downloadSvg() {
  const svgElement = document.querySelector('.react-flow__viewport');
  if (!svgElement) return;

  // Get the parent SVG element
  const flowPane = document.querySelector('.react-flow__pane');
  if (!flowPane) return;

  const svgClone = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svgClone.setAttribute('width', '2000');
  svgClone.setAttribute('height', '1500');
  svgClone.innerHTML = svgElement.outerHTML;

  const svgBlob = new Blob([svgClone.outerHTML], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'event-graph.svg';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function Header({ stats, onRefresh }: HeaderProps) {
  return (
    <div className="header">
      <div className="header-title">
        <span className="header-logo">🔗</span>
        <span>Event Graph</span>
      </div>

      <div className="header-stats">
        <div className="stat-item">
          <span>🎮</span>
          <span className="stat-count">{stats.controllers}</span>
          <span>Controllers</span>
        </div>
        <div className="stat-item">
          <span>⚡</span>
          <span className="stat-count">{stats.commands}</span>
          <span>Commands</span>
        </div>
        <div className="stat-item">
          <span>❓</span>
          <span className="stat-count">{stats.queries}</span>
          <span>Queries</span>
        </div>
        <div className="stat-item">
          <span>📢</span>
          <span className="stat-count">{stats.events}</span>
          <span>Events</span>
        </div>
        <div className="stat-item">
          <span>👂</span>
          <span className="stat-count">
            {stats.commandHandlers + stats.queryHandlers + stats.eventHandlers}
          </span>
          <span>Handlers</span>
        </div>
        <button
          onClick={onRefresh}
          style={{
            background: '#334155',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            color: '#e2e8f0',
            cursor: 'pointer',
            marginLeft: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          🔄 Refresh
        </button>
        <button
          onClick={downloadSvg}
          style={{
            background: '#334155',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            color: '#e2e8f0',
            cursor: 'pointer',
            marginLeft: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          📥 Export
        </button>
      </div>
    </div>
  );
}
