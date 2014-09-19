udefine(['eventmap'], function(EventMap) {
  'use strict';

  // `Graphics` is an instance of an `EventMap`
  var Graphics = new EventMap();

  // Special property `renderer` can be modified, but not deleted
  Object.defineProperty(Graphics, 'renderer', {
    value: null,
    enumerable: true
  });

  return Graphics;
});
