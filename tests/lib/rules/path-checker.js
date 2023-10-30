/**
 * @fileoverview FSD relative path checker
 * @author Michael Yakovlev
 */
'use strict';

const rule = require('../../../lib/rules/path-checker'),
  RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
});

ruleTester.run('path-checker', rule, {
  valid: [
    {
      filename: `/project/src/features/ArticleRating/ui/ArticleRating/ArticleRating.tsx`,
      code: `import { ArticleRatingProps } from './ArticleRating.types';`,
      errors: [],
    },
  ],

  invalid: [
    {
      filename: `/project/src/features/ArticleRating/ui/ArticleRating/ArticleRating.tsx`,
      code: `import { ArticleRatingProps } from 'features/ArticleRating/ui/ArticleRating/ArticleRating.types';`,
      errors: [{ message: 'В рамках одного слайса все пути должны быть относительными' }],
    },
    {
      filename: `/project/src/features/ArticleRating/ui/ArticleRating/ArticleRating.tsx`,
      code: `import { ArticleRatingProps } from '@/features/ArticleRating/ui/ArticleRating/ArticleRating.types';`,
      errors: [{ message: 'В рамках одного слайса все пути должны быть относительными' }],
      options: [
        {
          alias: '@',
        },
      ],
    },
  ],
});
