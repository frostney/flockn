'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _EventMap = require('eventmap');

var _EventMap2 = _interopRequireWildcard(_EventMap);

// `Graphics` is an instance of an `EventMap`
var Graphics = new _EventMap2['default']();

// Special property `renderer` can be modified, but not deleted
Object.defineProperty(Graphics, 'renderer', {
  value: null,
  writable: true,
  enumerable: true
});

exports['default'] = Graphics;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map