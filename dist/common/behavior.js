"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Base = _interopRequire(require("flockn/base"));

var Group = _interopRequire(require("flockn/group"));

var _flocknMixins = require("flockn/mixins");

var addable = _flocknMixins.addable;
var updateable = _flocknMixins.updateable;
var serializable = _flocknMixins.serializable;

// Behaviors only provide logic. There is no rendering involved.
// Behaviors can attach any number of behaviors to itself

var Behavior = (function (_Base) {
  function Behavior(descriptor) {
    _classCallCheck(this, Behavior);

    _Base.call(this, "Behavior", descriptor);

    // Reference to the game object itself
    this.gameObject = null;

    // Mix in `updateable`
    updateable.call(this);
  }

  _inherits(Behavior, _Base);

  Behavior.prototype.addBehavior = function addBehavior() {
    // When a behavior is added, the reference to the game object is set
    this.queue.push(addable(Behavior, this.children, function (child) {
      child.gameObject = this.gameObject;
    }).apply(this, arguments));
  };

  Behavior.prototype.removeBehavior = function removeBehavior() {};

  return Behavior;
})(Base);

serializable(Behavior);

module.exports = Behavior;
//# sourceMappingURL=behavior.js.map