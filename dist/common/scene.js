'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Base2 = require('./base');

var _Base3 = _interopRequireWildcard(_Base2);

var _GameObject = require('./gameobject');

var _GameObject2 = _interopRequireWildcard(_GameObject);

var _addable$renderable$updateable$serializable = require('./mixins');

// A `Scene` instance is a layer for `GameObject` instances.
// Any number of game objects can be added to a scene. Only one scene should be visible at the same time, depending
// on what was set in the `activeScene` property of a `Game` instance.

var Scene = (function (_Base) {
  function Scene(descriptor) {
    _classCallCheck(this, Scene);

    _Base.call(this, 'Scene', descriptor);

    this.visible = true;

    // Mix in `renderable` and `updateable`
    _addable$renderable$updateable$serializable.renderable.call(this);
    _addable$renderable$updateable$serializable.updateable.call(this);
  }

  _inherits(Scene, _Base);

  Scene.prototype.addGameObject = function addGameObject() {
    // Allow game objects to be added to scenes
    this.queue.push(_addable$renderable$updateable$serializable.addable(_GameObject2['default'], this.children).apply(this, arguments));
  };

  return Scene;
})(_Base3['default']);

_addable$renderable$updateable$serializable.serializable(Scene);

exports['default'] = Scene;
module.exports = exports['default'];
//# sourceMappingURL=scene.js.map