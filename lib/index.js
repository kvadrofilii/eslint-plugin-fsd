/**
 * @fileoverview FSD eslint plugins
 * @author Michael Yakovlev
 */
'use strict';

const requireIndex = require('requireindex');

// import all rules in lib/rules
module.exports.rules = requireIndex(__dirname + '/rules');

// import processors
module.exports.processors = {
  // add your processors here
};
