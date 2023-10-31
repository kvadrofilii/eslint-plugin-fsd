/**
 * @fileoverview FSD slice imports checker
 * @author Michael Yakovlev
 */
'use strict';

const path = require('path');
const { isPathRelative } = require('../helpers');
const micromatch = require('micromatch');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'des',
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
          ignoreImportPatterns: {
            type: 'array',
          },
        },
      },
    ],
    messages: {
      notRelative: 'Слой может импортировать в себя только нижележащие слои',
    },
  },

  create(context) {
    const layers = {
      app: ['pages', 'widgets', 'features', 'shared', 'entities'],
      pages: ['widgets', 'features', 'shared', 'entities'],
      widgets: ['features', 'shared', 'entities'],
      features: ['shared', 'entities'],
      entities: ['shared', 'entities'],
      shared: ['shared'],
    };

    const availableLayers = {
      app: 'app',
      entities: 'entities',
      features: 'features',
      shared: 'shared',
      pages: 'pages',
      widgets: 'widgets',
    };

    const { alias = '', ignoreImportPatterns = [] } = context.options.length > 0 ? context.options[0] : {};

    const getCurrentFileLayer = () => {
      const currentPath = context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename();

      const fromArray = currentPath.split(path.sep);
      const srcPosition = fromArray.lastIndexOf('src');
      const segments = fromArray.slice(srcPosition + 1);

      return segments[0];
    };

    return {
      ImportDeclaration(node) {
        const value = node.source.value;
        const importPath = alias ? value.replace(`${alias}/`, '') : value;

        if (isPathRelative(importPath)) {
          return;
        }

        const currentFileLayer = getCurrentFileLayer();
        const segments = importPath.split('/');
        const importLayer = segments[0];

        if (!availableLayers[importLayer] || !availableLayers[currentFileLayer]) {
          return;
        }

        const isIgnored = ignoreImportPatterns.some((pattern) => micromatch.isMatch(importPath, pattern));

        if (isIgnored) {
          return;
        }

        if (layers[currentFileLayer] && !layers[currentFileLayer].includes(importLayer)) {
          context.report({ node: node, messageId: 'notRelative' });
        }
      },
    };
  },
};
