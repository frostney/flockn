// These are things that might be moved into freezedev/gameboard

import { Vector2 } from '../types';

const events = ['click', 'mousedown', 'mouseup', 'mouseover'];

const absolutePosition = function absolutePosition(event, rootElement) {
  return new Vector2(event.pageX - rootElement.offsetLeft, event.pageY - rootElement.offsetTop);
};

const relativePosition = function relativePosition(event, rootElement, offset) {
  // Normalize offset
  const offsetVector =
    Object.hasOwnProperty.call(offset, 'x') && Object.hasOwnProperty.call(offset, 'y')
      ? offset
      : new Vector2(offset.left, offset.top);

  return absolutePosition(event, rootElement).subtract(offsetVector);
};

export { events, absolutePosition, relativePosition };
