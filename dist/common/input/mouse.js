'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
// These are things that might be moved into freezedev/gameboard

var _Vector2 = require('../types');

var events = ['click', 'mousedown', 'mouseup', 'mouseover'];

var absolutePosition = function absolutePosition(event, rootElement) {
  return new _Vector2.Vector2(event.pageX - rootElement.offsetLeft, event.pageY - rootElement.offsetTop);
};

var relativePosition = function relativePosition(event, rootElement, offset) {
  // Normalize offset
  var offsetVector = Object.hasOwnProperty.call(offset, 'x') && Object.hasOwnProperty.call(offset, 'y') ? offset : new _Vector2.Vector2(offset.left, offset.top);

  return absolutePosition(event, rootElement).subtract(offsetVector);
};

exports.events = events;
exports.absolutePosition = absolutePosition;
exports.relativePosition = relativePosition;
//# sourceMappingURL=mouse.js.map