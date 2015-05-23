'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _eventmap = require('eventmap');

var _eventmap2 = _interopRequireDefault(_eventmap);

// `Graphics` is an instance of an `EventMap`
var Graphics = new _eventmap2['default']();

// Special property `renderer` can be modified, but not deleted
Object.defineProperty(Graphics, 'renderer', {
  value: null,
  writable: true,
  enumerable: true
});

exports['default'] = Graphics;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map