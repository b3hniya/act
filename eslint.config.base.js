import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import tseslint from 'typescript-eslint';

/**
 * Shared ignores for all packages
 */
export const ignores = ['**/dist/**', '**/node_modules/**', '**/.turbo/**', '**/coverage/**'];

/**
 * Shared ESLint rules for all packages
 * @type {import('eslint').Linter.RulesRecord}
 */
export const commonRules = {
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  '@typescript-eslint/no-empty-function': 'warn',
  'prettier/prettier': 'error',
};

/**
 * Shared prettier plugin config
 */
export const prettierPlugin = { prettier };

/**
 * Base config array - ignores + JS recommended + TS recommended
 */
export const baseConfig = [{ ignores }, js.configs.recommended, ...tseslint.configs.recommended];
