import EventMap from 'eventmap';

// `Graphics` is an instance of an `EventMap`
const Graphics = new EventMap();

// Special property `renderer` can be modified, but not deleted
Object.defineProperty(Graphics, 'renderer', {
  value: null,
  writable: true,
  enumerable: true,
});

export default Graphics;
