import { run } from 'eslint-vitest-rule-tester'
import { layerImportsRule } from './layer-imports'
import { aliasOptions, parserOptions } from '../constants'

const errors = [{ message: 'Слой может импортировать в себя только нижележащие слои' }]

run({
    name: 'layer-imports',
    rule: layerImportsRule,
    parserOptions,

    valid: [
        {
            filename: 'project/src/features/article.tsx',
            code: "import { Button } from 'shared/ui'",
        },
        {
            filename: 'project/src/features/article.tsx',
            code: "import { Button } from '~/shared/ui'",
            options: aliasOptions,
        },
        {
            filename: 'project/src/features/article.tsx',
            code: "import { addCommentFormActions } from 'entities/article'",
        },
        {
            filename: 'project/src/features/article.tsx',
            code: "import { addCommentFormActions } from '~/entities/article'",
            options: aliasOptions,
        },
        {
            filename: 'project/src/app/providers.tsx',
            code: "import { addCommentFormActions, addCommentFormReducer } from 'widgets/article'",
        },
        {
            filename: 'project/src/app/providers.tsx',
            code: "import { addCommentFormActions, addCommentFormReducer } from '~/widgets/article'",
            options: aliasOptions,
        },
        {
            filename: 'project/src/widgets/pages.tsx',
            code: "import { useLocation } from 'react-router-dom'",
        },
        {
            filename: 'project/src/widgets/pages.tsx',
            code: "import { useLocation } from 'react-router-dom'",
            options: aliasOptions,
        },
        {
            filename: 'project/src/index.tsx',
            code: "import { StoreProvider } from 'app/providers';",
        },
        {
            filename: 'project/src/index.tsx',
            code: "import { StoreProvider } from '~/app/providers';",
            options: aliasOptions,
        },
        {
            filename: 'project/src/shared/ui/button.ts',
            code: "import { StoreProvider } from 'shared/utils';",
        },
        {
            filename: 'project/src/shared/ui/button.ts',
            code: "import { StoreProvider } from '~/shared/utils';",
            options: aliasOptions,
        },
        {
            filename: 'project/src/app/ui/button.ts',
            code: "import { StoreProvider } from 'app/utils';",
        },
        {
            filename: 'project/src/app/ui/button.ts',
            code: "import { StoreProvider } from '~/app/utils';",
            options: aliasOptions,
        },
    ],

    invalid: [
        {
            filename: 'project/src/entities/providers.tsx',
            code: "import { addCommentFormActions } from 'features/article'",
            errors,
        },
        {
            filename: 'project/src/entities/providers.tsx',
            code: "import { addCommentFormActions } from '~/features/article'",
            options: aliasOptions,
            errors,
        },
        {
            filename: 'project/src/features/providers.tsx',
            code: "import { addCommentFormActions, addCommentFormReducer } from '~/widgets/article'",
            options: aliasOptions,
            errors,
        },
        {
            filename: 'project/src/entities/providers.tsx',
            code: "import { addCommentFormActions, addCommentFormReducer } from '~/widgets/article'",
            options: aliasOptions,
            errors,
        },
        {
            filename: 'project/src/entities/article.tsx',
            code: "import { StoreProvider } from 'app/providers'",
            errors,
        },
        {
            filename: 'project/src/entities/article.tsx',
            code: "import { StoreProvider } from '~/app/providers'",
            options: aliasOptions,
            errors,
        },
        {
            filename: 'project/src/entities/article.tsx',
            code: "import { StoreProvider } from 'entities/providers'",
            errors,
        },
        {
            filename: 'project/src/entities/article.tsx',
            code: "import { StoreProvider } from '~/entities/providers'",
            options: aliasOptions,
            errors,
        },
    ],
})
