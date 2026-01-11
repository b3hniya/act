import { baseConfig, commonRules, prettierPlugin } from './eslint.config.base.js';

export default [
  ...baseConfig,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { ...prettierPlugin },
    rules: { ...commonRules },
  },
];
