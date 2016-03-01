import EventMap from 'eventmap';

import {Input} from 'gamebox';

import Audio from './audio';
import Group from './group';
import World from './world';

let objectIndex = 0;

const prependMax = 10000;

const numToIdString = num => {
  let stringNum = num + '';

  if (num >= prependMax) {
    return stringNum;
  }

  const prependLength = (prependMax + '').length - stringNum.length;
  for (let i = 0; i < prependLength; i++) {
    stringNum = '0' + stringNum;
  }

  return stringNum;
};

class Base extends EventMap {
  constructor(type = 'Base', descriptor = () => ({})) {
    super();

    // Count up `objectIndex` and stringify it
    const currentObject = numToIdString(++objectIndex);

    this.type = type;

    const internalId = `${this.type}-${Date.now()}-${currentObject}`;

    this.name = internalId;

    // The `id` property is read-only and returns the type and the stringified object index
    Object.defineProperty(this, 'id', {
      get: () => internalId,
      enumerable: true,
    });

    // Save the descriptor
    this.descriptor = descriptor;

    // Create a new group for all children elements
    this.children = new Group();

    // Add a queue: All addable elements will be pushed into the queue first and called after everything else in
    // the `descriptor` has been called
    this.queue = [];

    this.parent = null;

    // `Input` should be available in instances derived from `Base`
    this.input = Input;

    // As should `Audio`
    this.audio = Audio;

    // Emit an event
    this.trigger('constructed');
  }

  apply(initialData) {
    let data;

    // TODO: Reflect if function check should be enforced here
    if (this.descriptor) {
      // If args is not an array or array-like, provide an empty one
      data = initialData || {};

      // Call the `descriptor` property with `args`

      // object, {data, World}
      this.descriptor.call(this, this, {data, World});

      // Trigger an event
      this.trigger('execute');

      // TODO: Impose an order in the queue, such as:
      // (Game) -> Scene -> GameObject -> Behavior -> Model

      // TODO: Implement z-order
      this.queue.forEach(q => {
        if (q) {
          q();
        }
      });

      // Reset the queue
      this.queue = [];

      // Find a way to directly before and after events
      this.trigger('executed');
    }
  }

  call() {
    // Call `Base#apply` with the arguments object
    this.apply(arguments);
  }

  // Alias for `Base#call`
  reset() {
    return this.call.apply(this, arguments);
  }

  closest() {

  }

  find() {

  }

  log() {
    if (console && console.log) {
      const argArray = [].slice.call(arguments);

      // Log with `console.log`: Prepend the type and name
      argArray.unshift(':');
      argArray.unshift(this.name);
      argArray.unshift(this.type);

      return console.log.apply(console, argArray);
    }
  }
}

Base.queueOrder = ['Game', 'Scene', 'GameObject', 'Behavior', 'Model'];

export default Base;
