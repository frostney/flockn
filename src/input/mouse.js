// These are things that might be moved into freezedev/gameboard

import Vector2 from '../types/vector2';

var events = ['click', 'mousedown', 'mouseup', 'mouseover'];

var absolutePosition = function(event, rootElement) {
  return new Vector2(event.pageX - rootElement.offsetLeft, event.pageY - rootElement.offsetTop);
};

var relativePosition = function(event, rootElement, offset) {
  // Normalize offset
  var offsetVector = (Object.hasOwnProperty.call(offset, 'x') && Object.hasOwnProperty.call(offset, 'y')) ? offset : new Vector2(offset.left, offset.top);

  return absolutePosition(event, rootElement).subtract(offsetVector);
};

export {events, absolutePosition, relativePosition};
