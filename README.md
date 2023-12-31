# @kvadrofilii/eslint-plugin-fsd

ESLint rules for Feature-Sliced Design.

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm install eslint --save-dev
```

Next, install `@kvadrofilii/eslint-plugin-fsd`:

```sh
npm install @kvadrofilii/eslint-plugin-fsd --save-dev
```

## Usage

Add `@kvadrofilii/eslint-plugin-fsd` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["@kvadrofilii/fsd"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "@kvadrofilii/fsd/path-checker": "error",
    "@kvadrofilii/fsd/public-api-imports": "error",
    "@kvadrofilii/fsd/layer-imports": "error"
  }
}
```

Use alias paths.

```json
{
  "rules": {
    "@kvadrofilii/fsd/path-checker": ["error", { "alias": "@" }],
    "@kvadrofilii/fsd/public-api-imports": ["error", { "alias": "@" }],
    "@kvadrofilii/fsd/layer-imports": ["error", { "alias": "@" }]
  }
}
```

Use test files pattern for path-checker.

```json
{
  "rules": {
    "@kvadrofilii/fsd/path-checker": ["error", { "testFilesPatterns": ["**/*.test.*", "**/*.stories.*"] }]
  }
}
```

Use ignore import pattern for layer-imports.

```json
{
  "rules": {
    "@kvadrofilii/fsd/layer-imports": ["error", { "ignoreImportPatterns": ["**/StoreProvider"] }]
  }
}
```

## Rules

<!-- begin auto-generated rules list -->

| Name                                       | Description               |
| :----------------------------------------- | :------------------------ |
| [path-checker](docs/rules/path-checker.md) | FSD relative path checker |

<!-- end auto-generated rules list -->
