// @ts-check
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { baseConfig, commonRules, prettierPlugin } from '../../eslint.config.base.js';

export default tseslint.config(
  ...baseConfig,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: { ...globals.node, ...globals.jest },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { ...prettierPlugin },
    rules: {
      ...commonRules,
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },
);
