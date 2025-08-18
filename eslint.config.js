import { oxlint } from 'eslint-plugin-oxlint'
import globals from 'globals'

export default [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**']
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
      }
    }
  },
  oxlint(),
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.vue'],
    rules: {
      'no-undef': 'off'
    }
  }
]