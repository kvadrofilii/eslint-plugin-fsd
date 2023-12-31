/**
 * @fileoverview FSD relative path checker
 * @author Michael Yakovlev
 */
'use strict';

const path = require('path');
const { isPathRelative } = require('../helpers');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'FSD relative path checker',
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
        },
      },
    ],
    messages: {
      notRelative: 'В рамках одного слайса все пути должны быть относительными',
    },
  },

  create(context) {
    const alias = context.options.length > 0 ? context.options[0].alias : '';

    return {
      ImportDeclaration(node) {
        const value = node.source.value;
        const importPath = alias ? value.replace(`${alias}/`, '') : value;

        if (isPathRelative(importPath)) {
          return false;
        }

        const currentPath = context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename();

        if (shouldBeRelative(currentPath, importPath)) {
          context.report({ node, messageId: 'notRelative' });
        }
      },
    };
  },
};

const layers = {
  entities: 'entities',
  features: 'features',
  shared: 'shared',
  pages: 'pages',
  widgets: 'widgets',
};

function shouldBeRelative(fromFilename, importPath) {
  // example entities/Article
  const toArray = importPath.split(path.sep);
  const toLayer = toArray[0]; // entities
  const toSlice = toArray[1]; // Article

  if (!toLayer || !toSlice || !layers[toLayer]) {
    return false;
  }

  const fromArray = fromFilename.split(path.sep);
  const srcPosition = fromArray.lastIndexOf('src');
  const projectFrom = fromArray.slice(srcPosition + 1);
  const fromLayer = projectFrom[0];
  const fromSlice = projectFrom[1];

  if (!fromLayer || !fromSlice || !layers[fromLayer]) {
    return false;
  }

  if (toLayer === 'shared' && fromLayer === 'shared') {
    return false;
  }

  return fromSlice === toSlice && fromLayer === toLayer;
}
