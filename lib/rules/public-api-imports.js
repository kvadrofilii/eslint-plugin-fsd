/**
 * @fileoverview FSD api path checker
 * @author Michael Yakovlev
 */
'use strict';

const { isPathRelative } = require('../helpers');
const micromatch = require('micromatch');

module.exports = {
  meta: {
    type: `problem`,
    docs: {
      description: 'FSD api path checker',
      recommended: false,
      url: null,
    },
    fixable: null,
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
    const { alias = '', testFilesPatterns = [] } = context.options.length > 0 ? context.options[0] : {};

    const permittedLayers = {
      entities: 'entities',
      features: 'features',
      pages: 'pages',
      widgets: 'widgets',
    };

    return {
      ImportDeclaration(node) {
        const value = node.source.value;
        const importTo = alias ? value.replace(`${alias}/`, '') : value;

        if (isPathRelative(importTo)) {
          return;
        }

        const segments = importTo.split('/');
        const layer = segments[0];

        if (!permittedLayers[layer]) {
          return;
        }

        const isImportNotFromPublicApi = segments.length > 2;
        const isTestingPublicApi = segments[2] === 'testing' && segments.length < 4;

        if (isImportNotFromPublicApi && !isTestingPublicApi) {
          context.report({ node: node, messageId: 'problemImport' });
        }

        if (isTestingPublicApi) {
          const currentFilename = context.getFilename();

          const isCurrentFileTesting = testFilesPatterns.some((pattern) =>
            micromatch.isMatch(currentFilename, pattern),
          );

          if (!isCurrentFileTesting) {
            context.report({ node: node, messageId: 'problemImportInTestFiles' });
          }
        }
      },
    };
  },
};
