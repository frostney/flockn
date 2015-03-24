"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var EventMap = _interopRequire(require("eventmap"));

var Input = require("gamebox").Input;
var Audio = _interopRequire(require("flockn/audio"));

var Group = _interopRequire(require("flockn/group"));

var World = _interopRequire(require("flockn/world"));

var objectIndex = 0;

var prependMax = 10000;

var numToIdString = function (num) {
  var stringNum = num + "";

  if (num >= prependMax) {
    return stringNum;
  } else {
    var prependLength = (prependMax + "").length - stringNum.length;
    for (var i = 0; i < prependLength; i++) {
      stringNum = "0" + stringNum;
    }

    return stringNum;
  }
};

var Base = (function (EventMap) {
  function Base() {
    var type = arguments[0] === undefined ? "Base" : arguments[0];
    var descriptor = arguments[1] === undefined ? function () {} : arguments[1];
    _classCallCheck(this, Base);

    EventMap.call(this);

    // Count up `objectIndex` and stringify it
    var currentObject = numToIdString(++objectIndex);

    this.type = type;

    var internalId = "" + this.type + "-" + Date.now() + "-" + currentObject;

    this.name = internalId;

    // The `id` property is read-only and returns the type and the stringified object index
    Object.defineProperty(this, "id", {
      get: function () {
        return internalId;
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

    // As should `Audio`
    this.audio = Audio;

    // Emit an event
    this.trigger("constructed");
  }

  _inherits(Base, EventMap);

  Base.prototype.apply = function apply(data) {
    // TODO: Reflect if function check should be enforced here
    if (this.descriptor) {
      // If args is not an array or array-like, provide an empty one
      data = data || {};

      // Call the `descriptor` property with `args`

      // Game, world, data
      this.descriptor.call(this, data, World);

      // Trigger an event
      this.trigger("execute");

      // TODO: Impose an order in the queue, such as:
      // (Game) -> Scene -> GameObject -> Behavior -> Model

      // TODO: Implement z-order
      this.queue.forEach(function (q) {
        q && q();
      });

      // Reset the queue
      this.queue = [];

      // Find a way to directly before and after events
      this.trigger("executed");
    }
  };

  Base.prototype.call = function call() {
    // Call `Base#apply` with the arguments object
    this.apply(arguments);
  };

  // Alias for `Base#call`
  Base.prototype.reset = function reset() {
    return this.call.apply(this, arguments);
  };

  Base.prototype.closest = function closest() {};

  Base.prototype.find = function find() {};

  Base.prototype.log = function log() {
    if (console && console.log) {
      var argArray = [].slice.call(arguments);

      // Log with `console.log`: Prepend the type and name
      argArray.unshift(":");
      argArray.unshift(this.name);
      argArray.unshift(this.type);

      return console.log.apply(console, argArray);
    }
  };

  return Base;
})(EventMap);

Base.queueOrder = ["Game", "Scene", "GameObject", "Behavior", "Model"];

module.exports = Base;
//# sourceMappingURL=base.js.map