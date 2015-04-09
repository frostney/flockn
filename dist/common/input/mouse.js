'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});
// These are things that might be moved into freezedev/gameboard

var _Vector2 = require('flockn/types/vector2');

var _Vector22 = _interopRequireWildcard(_Vector2);

var events = ['click', 'mousedown', 'mouseup', 'mouseover'];

var absolutePosition = function absolutePosition(event, rootElement) {
  return new _Vector22['default'](event.pageX - rootElement.offsetLeft, event.pageY - rootElement.offsetTop);
};

var relativePosition = function relativePosition(event, rootElement, offset) {
  // Normalize offset
  var offsetVector = Object.hasOwnProperty.call(offset, 'x') && Object.hasOwnProperty.call(offset, 'y') ? offset : new _Vector22['default'](offset.left, offset.top);

  return absolutePosition(event, rootElement).subtract(offsetVector);
};

exports.events = events;
exports.absolutePosition = absolutePosition;
exports.relativePosition = relativePosition;
//# sourceMappingURL=mouse.js.map