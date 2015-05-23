'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _group = require('./group');

var _group2 = _interopRequireDefault(_group);

var _mixins = require('./mixins');

// Behaviors only provide logic. There is no rendering involved.
// Behaviors can attach any number of behaviors to itself

var Behavior = (function (_Base) {
  function Behavior(descriptor) {
    _classCallCheck(this, Behavior);

    _Base.call(this, 'Behavior', descriptor);

    // Reference to the game object itself
    this.gameObject = null;

    // Mix in `updateable`
    _mixins.updateable.call(this);
  }

  _inherits(Behavior, _Base);

  Behavior.prototype.addBehavior = function addBehavior() {
    // When a behavior is added, the reference to the game object is set
    this.queue.push(_mixins.addable(Behavior, this.children, function (child) {
      child.gameObject = this.gameObject;
    }).apply(this, arguments));
  };

  Behavior.prototype.removeBehavior = function removeBehavior() {};

  return Behavior;
})(_base2['default']);

_mixins.serializable(Behavior);

exports['default'] = Behavior;
module.exports = exports['default'];
//# sourceMappingURL=behavior.js.map