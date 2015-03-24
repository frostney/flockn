"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Base = _interopRequire(require("flockn/base"));

var GameObject = _interopRequire(require("flockn/gameobject"));

var _flocknMixins = require("flockn/mixins");

var addable = _flocknMixins.addable;
var renderable = _flocknMixins.renderable;
var updateable = _flocknMixins.updateable;
var serializable = _flocknMixins.serializable;
var storable = _flocknMixins.storable;


// A `Scene` instance is a layer for `GameObject` instances.
// Any number of game objects can be added to a scene. Only one scene should be visible at the same time, depending
// on what was set in the `activeScene` property of a `Game` instance.
var Scene = (function (Base) {
  function Scene(descriptor) {
    _classCallCheck(this, Scene);

    Base.call(this, "Scene", descriptor);

    this.visible = true;

    // Mix in `renderable` and `updateable`
    renderable.call(this);
    updateable.call(this);
  }

  _inherits(Scene, Base);

  Scene.prototype.addGameObject = function addGameObject() {
    // Allow game objects to be added to scenes
    this.queue.push(addable(GameObject, this.children).apply(this, arguments));
  };

  return Scene;
})(Base);

serializable(Scene);
storable(Scene);

module.exports = Scene;
//# sourceMappingURL=scene.js.map