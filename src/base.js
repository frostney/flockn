import * as mixedice from 'mixedice';
import * as EventMap from 'eventmap';

import * as Input from 'gameboard/input';

import Audio from 'flockn/audio';
import Group from 'flockn/group';
import World from 'flockn/world';

var objectIndex = 0;

var prependMax = 10000;

var numToIdString = function(num) {
  var stringNum = num + '';

  if (num >= prependMax) {
    return stringNum;
  } else {
    var prependLength = (prependMax + '').length - stringNum.length;
    for (var i = 0; i < prependLength; i++) {
      stringNum = '0' + stringNum;
    }

    return stringNum;
  }
};

class Base {
  constructor(type, descriptor) {
    // Mix in an `EventMap` instance into `Base`
    mixedice([this, Base.prototype], new EventMap());

    type = type || 'Base';

    this.type = type;
    this.name = this.type + '-' + Date.now();

    // Count up `objectIndex` and stringify it
    var currentObject = numToIdString(++objectIndex);

    // The `id` property is read-only and returns the type and the stringified object index
    Object.defineProperty(this, 'id', {
      get: function() {
        return this.type + '-' + currentObject;
      },
      enumerable: true
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

    // As should `Audio`...
    this.audio = Audio;

    // ...and `World`
    this.world = World;

    // Emit an event
    this.trigger('constructed');
  }

  apply(args) {
    // TODO: Reflect if function check should be enforced here
    if (this.descriptor) {
      // If args is not an array or array-like, provide an empty one
      args = args || [];

      // Call the `descriptor` property with `args`
      this.descriptor.apply(this, args);

      // Trigger an event
      this.trigger('execute');

      // TODO: Impose an order in the queue, such as:
      // (Game) -> Scene -> GameObject -> Behavior -> Model

      // TODO: Implement z-order
      this.queue.forEach(function(q) {
        q && q();
      });

      // Reset the queue
      this.queue = [];
    }
  }

  closest() {

  }

  find() {

  }

  log() {
    if (console && console.log) {
      var argArray = [].slice.call(arguments);

      // Log with `console.log`: Prepend the type and name
      argArray.unshift(':');
      argArray.unshift(this.name);
      argArray.unshift(this.type);

      return console.log.apply(console, argArray);
    }
  }

  // Shorthand function to derive from the Base object
  static extend(target, type, descriptor) {
    var base = new Base(type, descriptor);

    mixedice(target, base);
  }
}

Base.queueOrder = ['Game', 'Scene', 'GameObject', 'Behavior', 'Model'];

Base.prototype.call = Base.prototype.reset = function() {
  // Call `Base#apply` with the arguments object
  this.apply(arguments);
};

export default Base;
