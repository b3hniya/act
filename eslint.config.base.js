/**
 * Shared ESLint rules for all packages
 * @type {import('eslint').Linter.RulesRecord}
 */
export const commonRules = {
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  'prettier/prettier': ['error', { endOfLine: 'auto' }],
};
