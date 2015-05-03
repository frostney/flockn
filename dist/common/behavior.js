'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Base2 = require('./base');

var _Base3 = _interopRequireWildcard(_Base2);

var _Group = require('./group');

var _Group2 = _interopRequireWildcard(_Group);

var _addable$updateable$serializable = require('./mixins');

// Behaviors only provide logic. There is no rendering involved.
// Behaviors can attach any number of behaviors to itself

var Behavior = (function (_Base) {
  function Behavior(descriptor) {
    _classCallCheck(this, Behavior);

    _Base.call(this, 'Behavior', descriptor);

    // Reference to the game object itself
    this.gameObject = null;

    // Mix in `updateable`
    _addable$updateable$serializable.updateable.call(this);
  }

  _inherits(Behavior, _Base);

  Behavior.prototype.addBehavior = function addBehavior() {
    // When a behavior is added, the reference to the game object is set
    this.queue.push(_addable$updateable$serializable.addable(Behavior, this.children, function (child) {
      child.gameObject = this.gameObject;
    }).apply(this, arguments));
  };

  Behavior.prototype.removeBehavior = function removeBehavior() {};

  return Behavior;
})(_Base3['default']);

_addable$updateable$serializable.serializable(Behavior);

exports['default'] = Behavior;
module.exports = exports['default'];
//# sourceMappingURL=behavior.js.map