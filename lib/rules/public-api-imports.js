/**
 * @fileoverview FSD api path checker
 * @author Michael Yakovlev
 */
'use strict';

const { isPathRelative } = require('../helpers');
const micromatch = require('micromatch');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'FSD api path checker',
      recommended: false,
      url: null,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string',
          },
          testFilesPatterns: {
            type: 'array',
          },
        },
      },
    ],
    messages: {
      problemImport: 'Абсолютный импорт разрешен только из Public API (index.ts)',
      problemImportInTestFiles: 'Тестовые данные необходимо импортировать из publicApi/testing.ts',
    },
  },

  create(context) {
    const permittedLayers = {
      entities: 'entities',
      features: 'features',
      pages: 'pages',
      widgets: 'widgets',
    };

    const { alias = '', testFilesPatterns = [] } = context.options.length > 0 ? context.options[0] : {};

    return {
      ImportDeclaration(node) {
        const value = node.source.value;
        const importPath = alias ? value.replace(`${alias}/`, '') : value;

        // Если импорт относительный, то заканчиваем проверку
        if (isPathRelative(importPath)) {
          return;
        }

        const segments = importPath.split('/');
        const importLayer = segments[0];
        const importSlice = segments[1];

        // Если импорт не из FSD-slices, то заканчиваем проверку
        if (!permittedLayers[importLayer]) {
          return;
        }

        // Получаю путь проверяемого файла
        const currentPath = context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename();
        // Проверяю имя и путь на паттерн из options
        const isCurrentFileTesting = testFilesPatterns.some((pattern) => micromatch.isMatch(currentPath, pattern));

        // Если файл подходит под паттерн
        if (isCurrentFileTesting) {
          // Проверяю импорт из testing
          const isTestingPublicApi = segments[2] === 'testing' && segments.length < 4;

          if (!isTestingPublicApi) {
            context.report({
              node,
              messageId: 'problemImportInTestFiles',
              fix: (fixer) => {
                return fixer.replaceText(node.source, `'${alias}/${importLayer}/${importSlice}/testing'`);
              },
            });
          }
        } else {
          // Если сегментов в импорте больше двух, то импорт не из publicApi
          const isImportNotFromPublicApi = segments.length > 2;

          if (isImportNotFromPublicApi) {
            context.report({
              node,
              messageId: 'problemImport',
              fix: (fixer) => {
                return fixer.replaceText(node.source, `'${alias}/${importLayer}/${importSlice}'`);
              },
            });
          }
        }
      },
    };
  },
};
