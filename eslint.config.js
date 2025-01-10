import globals from 'globals';
import pluginJs from '@eslint/js';
import daStyle from 'eslint-config-dicodingacademy';

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  daStyle,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: { 'linebreak-style': 'off' },
  },
];
