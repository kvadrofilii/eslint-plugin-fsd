import { run } from 'eslint-vitest-rule-tester'
import { aliasOptions, parserOptions } from './constants'
import { publicApiImportsRule } from '../rules/public-api-imports'

const errors = [{ message: 'Абсолютный импорт разрешен только через public API - index.ts' }]

run({
    name: 'public-api-imports',
    rule: publicApiImportsRule,
    parserOptions,

    valid: [
        {
            code: `import { ArticleBlock } from '../../model/types/article.types';`,
        },
        {
            code: `import { ArticleBlock } from '../../model/types/article.types';`,
            options: aliasOptions,
        },
        {
            code: `import { CountrySelect } from 'entities/country';`,
        },
        {
            code: `import { CountrySelect } from '~/entities/country';`,
            options: aliasOptions,
        },
    ],

    invalid: [
        {
            filename: 'project/src/entities/forbidden.tsx',
            code: `import { CountrySelect } from 'entities/country/ui/CountrySelect';`,
            output: "import { CountrySelect } from 'entities/country';",
            errors,
        },
        {
            filename: 'project/src/entities/forbidden.tsx',
            code: `import { CountrySelect } from '~/entities/country/ui/CountrySelect';`,
            output: "import { CountrySelect } from '~/entities/country';",
            options: aliasOptions,
            errors,
        },
        {
            filename: 'project/src/entities/forbidden.tsx',
            code: "import { addCommentFormActions, addCommentFormReducer } from 'entities/article/testing';",
            output: "import { addCommentFormActions, addCommentFormReducer } from 'entities/article';",
            errors,
        },
        {
            filename: 'project/src/entities/forbidden.tsx',
            code: "import { addCommentFormActions, addCommentFormReducer } from '~/entities/article/testing';",
            output: "import { addCommentFormActions, addCommentFormReducer } from '~/entities/article';",
            options: aliasOptions,
            errors,
        },
    ],
})
