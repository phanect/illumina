import { core } from "@phanect/lint";
import { react } from "@phanect/lint-react";
import { defineConfig, globalIgnores, type Config } from "eslint/config";
import reactRefresh from 'eslint-plugin-react-refresh';
import i18next from 'eslint-plugin-i18next';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

const configs = defineConfig([
  globalIgnores([
    "dist/**"
  ]),

  i18next.configs['flat/recommended'] as Config,

  ...core,
  ...react,

  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // React 17 does not require importing React for JSX
      'react/react-in-jsx-scope': 'off',
      // Prefer importing specific items from React instead of the default import
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react',
              importNames: ['default'],
              message: 'Import specific items from react instead of the default import',
            },
          ],
        },
      ],
      // Prefer using inline props instead of React.FC or React.FunctionComponent
      '@typescript-eslint/no-restricted-types': [
        'error',
        {
          types: {
            'React.FC': {
              message: 'Use inline props instead of React.FC',
            },
            'React.FunctionComponent': {
              message: 'Use inline props instead of React.FunctionComponent',
            },
          },
        },
      ],
      // Avoid using export { ... };
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportNamedDeclaration[specifiers.length > 0]',
          message: 'Use inline exports instead of `export { ... };`.',
        },
      ],
    },
  },
  {
    // Do not add `files: [ "*" ],` here.

    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    plugins: {
      unicorn: eslintPluginUnicorn,
    },
    rules: {
      'unicorn/filename-case': [
        'warn',
        {
          case: 'kebabCase',
          ignore: [
            // match anything with a $ in it
            /.*\$.*/,
          ],
        },
      ],
    },
  },
]);

export default configs;
