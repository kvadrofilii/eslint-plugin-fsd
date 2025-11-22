import { run } from 'eslint-vitest-rule-tester'
import { aliasOptions, parserOptions } from './constants'
import { pathCheckerRule } from '../rules/path-checker'

const errors = [{ message: 'В рамках одного слайса не должно быть абсолютных импортов' }]

run({
    name: 'path-checker',
    rule: pathCheckerRule,
    parserOptions,

    valid: [
        {
            filename: 'project/src/features/ArticleRating/ui/ArticleRating/ArticleRating.tsx',
            code: `import { ArticleRatingProps } from './ArticleRating.types';`,
        },
    ],
    invalid: [
        {
            filename: `project/src/features/ArticleRating/ui/ArticleRating/ArticleRating.tsx`,
            code: `import { ArticleRatingProps } from 'features/ArticleRating/ui/ArticleRating/ArticleRating.types';`,
            errors,
        },
        {
            filename: `project/src/features/ArticleRating/ui/ArticleRating/ArticleRating.tsx`,
            code: `import { ArticleRatingProps } from '~/features/ArticleRating/ui/ArticleRating/ArticleRating.types';`,
            options: aliasOptions,
            errors,
        },
    ],
})
