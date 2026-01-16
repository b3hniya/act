import { FlowGraph } from './components/FlowGraph';
import { useGraphData } from './hooks/useGraphData';
import './styles/index.css';

function App() {
  const { data, loading, error, refetch } = useGraphData();

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        <div className="loading-text">Analyzing codebase...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <div className="error-icon">⚠️</div>
        <div className="error-text">{error}</div>
        <button
          onClick={refetch}
          style={{
            background: '#334155',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            color: '#e2e8f0',
            cursor: 'pointer',
            marginTop: '16px',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data || data.nodes.length === 0) {
    return (
      <div className="empty">
        <div className="empty-icon">📭</div>
        <div className="empty-text">No CQRS patterns found</div>
        <div className="empty-hint">
          Make sure you have controllers, commands, queries, and event handlers in your modules
          folder
        </div>
      </div>
    );
  }

  return <FlowGraph nodes={data.nodes} edges={data.edges} stats={data.stats} onRefresh={refetch} />;
}

export default App;
