/* eslint-disable no-unused-vars */
/* eslint-disable eslint-plugin/prefer-message-ids */
'use strict';

const path = require('path');

module.exports = {
  meta: {
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: 'FSD relative path checker',
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        // example app/entities/Article
        const importTo = node.source.value;

        // Путь файла, который проверяем
        const fromFilename = context.getFilename();

        // Текущая рабочая директория
        //const projectPath = context.getCwd();

        if (shouldBeRelative(fromFilename, importTo)) {
          context.report({ node: node, message: 'В рамках одного слайса все пути должны быть относительными' });
        }
      },
    };
  },
};

// Проверяю относительный ли путь
function isPathRelative(path) {
  return path === '.' || path.startsWith('./') || path.startsWith('../');
}

const layers = {
  entities: 'entities',
  features: 'features',
  shared: 'shared',
  pages: 'pages',
  widgets: 'widgets',
};

function shouldBeRelative(fromFilename, importTo) {
  if (isPathRelative(importTo)) {
    return false;
  }

  // example entities/Article
  const toArray = importTo.split(path.sep);
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
