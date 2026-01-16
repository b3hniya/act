import express from 'express';
import { analyze } from '../analyzer/index.js';
import { buildFlowGraph } from '../graph/builder.js';

const app = express();

let cachedAnalysis: Awaited<ReturnType<typeof analyze>> | null = null;
let rootPath: string = process.cwd();

export function setRootPath(path: string) {
  rootPath = path;
}

export async function analyzeAndCache() {
  console.log('🔍 Analyzing modules...');
  cachedAnalysis = await analyze(rootPath);
  console.log(`✅ Analysis complete:`);
  console.log(`   - ${cachedAnalysis.stats.controllers} Controllers`);
  console.log(`   - ${cachedAnalysis.stats.commands} Commands`);
  console.log(`   - ${cachedAnalysis.stats.queries} Queries`);
  console.log(`   - ${cachedAnalysis.stats.events} Events`);
  console.log(`   - ${cachedAnalysis.stats.commandHandlers} Command Handlers`);
  console.log(`   - ${cachedAnalysis.stats.queryHandlers} Query Handlers`);
  console.log(`   - ${cachedAnalysis.stats.eventHandlers} Event Handlers`);
  return cachedAnalysis;
}

app.get('/api/graph', async (req, res) => {
  try {
    // Re-analyze if requested
    if (req.query.refresh === 'true') {
      cachedAnalysis = null;
    }

    if (!cachedAnalysis) {
      cachedAnalysis = await analyze(rootPath);
    }

    const flowGraph = buildFlowGraph(cachedAnalysis, {
      direction: 'TB',
      nodeSpacing: 80,
      rankSpacing: 120,
    });

    res.json({
      nodes: flowGraph.nodes,
      edges: flowGraph.edges,
      stats: cachedAnalysis.stats,
    });
  } catch (error) {
    console.error('Error analyzing:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Analysis failed',
    });
  }
});

app.get('/api/refresh', async (req, res) => {
  try {
    cachedAnalysis = null;
    await analyzeAndCache();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Refresh failed',
    });
  }
});

export function startServer(port: number = 4201): Promise<void> {
  return new Promise((resolve) => {
    app.listen(port, () => {
      console.log(`🚀 API server running at http://localhost:${port}`);
      resolve();
    });
  });
}

export { app };
