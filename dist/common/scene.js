'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _gameobject = require('./gameobject');

var _gameobject2 = _interopRequireDefault(_gameobject);

var _mixins = require('./mixins');

// A `Scene` instance is a layer for `GameObject` instances.
// Any number of game objects can be added to a scene. Only one scene should be visible at the same time, depending
// on what was set in the `activeScene` property of a `Game` instance.

var Scene = (function (_Base) {
  function Scene(descriptor) {
    _classCallCheck(this, Scene);

    _Base.call(this, 'Scene', descriptor);

    this.visible = true;

    // Mix in `renderable` and `updateable`
    _mixins.renderable.call(this);
    _mixins.updateable.call(this);
  }

  _inherits(Scene, _Base);

  Scene.prototype.addGameObject = function addGameObject() {
    // Allow game objects to be added to scenes
    this.queue.push(_mixins.addable(_gameobject2['default'], this.children).apply(this, arguments));
  };

  return Scene;
})(_base2['default']);

_mixins.serializable(Scene);

exports['default'] = Scene;
module.exports = exports['default'];
//# sourceMappingURL=scene.js.map