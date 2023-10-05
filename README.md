# @kvadrofilii/eslint-plugin-fsd

test eslint plugin

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
    "@kvadrofilii/fsd/path-checker": "error"
  }
}
```

## Rules

<!-- begin auto-generated rules list -->

| Name                                       | Description               |
| :----------------------------------------- | :------------------------ |
| [path-checker](docs/rules/path-checker.md) | FSD relative path checker |

<!-- end auto-generated rules list -->