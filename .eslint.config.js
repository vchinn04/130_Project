// .eslint.config.js
import nextJs from '@next/eslint-plugin-next';
import reactCompiler from 'eslint-plugin-react-compiler';

export default [
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    ignores: [
      '**/node_modules/**',
      '.next/**',
      'out/**'
    ],
    plugins: {
      next: nextJs,
      'react-compiler': reactCompiler
    },
    rules: {
      ...nextJs.configs['core-web-vitals'].rules,
      ...nextJs.configs.typescript.rules,
      ...reactCompiler.configs.recommended.rules
    },
    settings: {
      next: {
        rootDir: "."
      },
      react: {
        version: 'detect'
      },
    }
  }
];
