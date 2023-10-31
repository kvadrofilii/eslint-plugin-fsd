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

        if (isPathRelative(importPath)) {
          return;
        }

        const segments = importPath.split('/');
        const importLayer = segments[0];

        if (!permittedLayers[importLayer]) {
          return;
        }

        const isImportNotFromPublicApi = segments.length > 2;
        const isTestingPublicApi = segments[2] === 'testing' && segments.length < 4;

        if (isImportNotFromPublicApi && !isTestingPublicApi) {
          context.report({ node: node, messageId: 'problemImport' });
        }

        if (isTestingPublicApi) {
          const currentPath = context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename();

          const isCurrentFileTesting = testFilesPatterns.some((pattern) => micromatch.isMatch(currentPath, pattern));

          if (!isCurrentFileTesting) {
            context.report({ node: node, messageId: 'problemImportInTestFiles' });
          }
        }
      },
    };
  },
};
