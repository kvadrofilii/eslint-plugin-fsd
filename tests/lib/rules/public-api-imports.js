/**
 * @fileoverview FSD api path checker
 * @author Michael Yakovlev
 */
'use strict';

const rule = require('../../../lib/rules/public-api-imports'),
  RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
});

const aliasOptions = [
  {
    alias: '@',
  },
];
const optionsTestFiles = [
  {
    alias: '@',
    testFilesPatterns: ['**/*.test.*', '**/*.stories.*', '**/StoreDecorator.tsx'],
  },
];

const errorMessage = [{ message: 'Абсолютный импорт разрешен только из Public API (index.ts)' }];
const errorMessageTestFiles = [{ message: 'Тестовые данные необходимо импортировать из publicApi/testing.ts' }];

ruleTester.run('public-api-imports', rule, {
  valid: [
    {
      code: `import { ArticleBlock } from '../../model/types/article.types';`,
      errors: [],
    },
    {
      code: `import { CountrySelect } from '@/entities/Country';`,
      errors: [],
      options: aliasOptions,
    },
    {
      filename: '/project/src/entities/file.test.ts',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      errors: [],
      options: optionsTestFiles,
    },
    {
      filename: '/project/src/entities/StoreDecorator.tsx',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      errors: [],
      options: optionsTestFiles,
    },
  ],

  invalid: [
    {
      code: `import { CountrySelect } from '@/entities/Country/ui/CountrySelect';`,
      errors: errorMessage,
      options: aliasOptions,
    },
    {
      filename: '/project/src/entities/StoreDecorator.tsx',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing/file.tsx'",
      errors: errorMessage,
      options: optionsTestFiles,
    },
    {
      filename: '/project/src/entities/forbidden.ts',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      errors: errorMessageTestFiles,
      options: optionsTestFiles,
    },
  ],
});
