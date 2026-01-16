import { useState, useEffect, useCallback } from 'react';
import type { FlowGraphData } from '../../graph/types';

interface Stats {
  controllers: number;
  commands: number;
  queries: number;
  events: number;
  commandHandlers: number;
  queryHandlers: number;
  eventHandlers: number;
}

interface GraphDataResponse {
  nodes: FlowGraphData['nodes'];
  edges: FlowGraphData['edges'];
  stats: Stats;
}

interface UseGraphDataReturn {
  data: GraphDataResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useGraphData(): UseGraphDataReturn {
  const [data, setData] = useState<GraphDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/graph');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch graph data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
