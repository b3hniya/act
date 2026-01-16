import { glob } from 'glob';
import path from 'path';

export interface ScanResult {
  files: string[];
  modulesPath: string;
}

/**
 * Scans the modules directory for TypeScript files
 */
export async function scanModules(rootPath: string): Promise<ScanResult> {
  const modulesPath = path.join(rootPath, 'modules');

  const files = await glob('**/*.ts', {
    cwd: modulesPath,
    absolute: true,
    ignore: ['**/node_modules/**', '**/dist/**', '**/*.spec.ts', '**/*.test.ts', '**/*.d.ts'],
  });

  return {
    files,
    modulesPath,
  };
}

/**
 * Extracts module name from file path
 */
export function getModuleName(filePath: string, modulesPath: string): string {
  const relativePath = path.relative(modulesPath, filePath);
  const parts = relativePath.split(path.sep);
  return parts[0] || 'unknown';
}
