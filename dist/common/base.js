'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _eventmap = require('eventmap');

var _eventmap2 = _interopRequireDefault(_eventmap);

var _gamebox = require('gamebox');

var _audio = require('./audio');

var _audio2 = _interopRequireDefault(_audio);

var _group = require('./group');

var _group2 = _interopRequireDefault(_group);

var _world = require('./world');

var _world2 = _interopRequireDefault(_world);

var objectIndex = 0;

var prependMax = 10000;

var numToIdString = function numToIdString(num) {
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

var Base = (function (_EventMap) {
  function Base() {
    var type = arguments[0] === undefined ? 'Base' : arguments[0];
    var descriptor = arguments[1] === undefined ? function () {} : arguments[1];

    _classCallCheck(this, Base);

    _EventMap.call(this);

    // Count up `objectIndex` and stringify it
    var currentObject = numToIdString(++objectIndex);

    this.type = type;

    var internalId = '' + this.type + '-' + Date.now() + '-' + currentObject;

    this.name = internalId;

    // The `id` property is read-only and returns the type and the stringified object index
    Object.defineProperty(this, 'id', {
      get: function get() {
        return internalId;
      },
      enumerable: true
    });

    // Save the descriptor
    this.descriptor = descriptor;

    // Create a new group for all children elements
    this.children = new _group2['default']();

    // Add a queue: All addable elements will be pushed into the queue first and called after everything else in
    // the `descriptor` has been called
    this.queue = [];

    this.parent = null;

    // `Input` should be available in instances derived from `Base`
    this.input = _gamebox.Input;

    // As should `Audio`
    this.audio = _audio2['default'];

    // Emit an event
    this.trigger('constructed');
  }

  _inherits(Base, _EventMap);

  Base.prototype.apply = function apply(data) {
    // TODO: Reflect if function check should be enforced here
    if (this.descriptor) {
      // If args is not an array or array-like, provide an empty one
      data = data || {};

      // Call the `descriptor` property with `args`

      // object, {data, World}
      this.descriptor.call(this, this, { data: data, World: _world2['default'] });

      // Trigger an event
      this.trigger('execute');

      // TODO: Impose an order in the queue, such as:
      // (Game) -> Scene -> GameObject -> Behavior -> Model

      // TODO: Implement z-order
      this.queue.forEach(function (q) {
        q && q();
      });

      // Reset the queue
      this.queue = [];

      // Find a way to directly before and after events
      this.trigger('executed');
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
      argArray.unshift(':');
      argArray.unshift(this.name);
      argArray.unshift(this.type);

      return console.log.apply(console, argArray);
    }
  };

  return Base;
})(_eventmap2['default']);

Base.queueOrder = ['Game', 'Scene', 'GameObject', 'Behavior', 'Model'];

exports['default'] = Base;
module.exports = exports['default'];
//# sourceMappingURL=base.js.map