"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Base = _interopRequire(require("flockn/base"));

var Behavior = _interopRequire(require("flockn/behavior"));

var Graphics = _interopRequire(require("flockn/graphics"));

var Group = _interopRequire(require("flockn/group"));

var Model = _interopRequire(require("flockn/model"));

var serialize = _interopRequire(require("flockn/serialize"));

var Texture = _interopRequire(require("flockn/texture"));

var _flocknTypes = require("flockn/types");

var Vector2 = _flocknTypes.Vector2;
var Vector3 = _flocknTypes.Vector3;
var Color = _flocknTypes.Color;
var Rect = _flocknTypes.Rect;
var _flocknMixins = require("flockn/mixins");

var addable = _flocknMixins.addable;
var renderable = _flocknMixins.renderable;
var updateable = _flocknMixins.updateable;
var serializable = _flocknMixins.serializable;
var storable = _flocknMixins.storable;
var GameObject = (function (Base) {
  function GameObject(descriptor) {
    var _this = this;
    _classCallCheck(this, GameObject);

    Base.call(this, "GameObject", descriptor);

    this.visible = true;

    this.position = new Vector3();

    this.fitToTexture = true;

    // Create a new texture and bind it to the `texture` property
    this.texture = new Texture();
    this.texture.parent = this;

    // Once the image is loaded, update width and height if `fitToTexture` is set
    this.texture.on("image-loaded", function () {
      if (_this.fitToTexture) {
        _this.width = _this.texture.image.width;
        _this.height = _this.texture.image.height;

        _this.origin.x = _this.width / 2;
        _this.origin.y = _this.height / 2;
      }

      // TODO: Evaluate if the Graphics trigger should only be in the texture
      Graphics.trigger("texture-image-loaded", _this, _this.texture);
    });

    // Once the label is loaded, update width and height if `fitToTexture` is set
    this.texture.on("label-loaded", function () {
      if (_this.fitToTexture) {
        _this.width = _this.texture.label.width;
        _this.height = _this.texture.label.height;

        _this.origin.x = _this.width / 2;
        _this.origin.y = _this.height / 2;

        // TODO: Evaluate if the Graphics trigger should only be in the texture
        Graphics.trigger("texture-label-loaded", _this, _this.texture);
      }
    });

    this.width = 0;
    this.height = 0;

    this.angle = 0;

    this.alpha = 1;

    this.scale = new Vector2(1, 1);

    this.origin = new Vector2(this.width / 2, this.width / 2);

    this.border = {
      width: 0,
      color: new Color(),
      radius: 0
    };

    // Add default model
    var defaultModel = new Model();
    defaultModel.name = "default";

    this.addModel(defaultModel);

    // Mix in renderable and updateable
    renderable.call(this);
    updateable.call(this);
  }

  _inherits(GameObject, Base);

  GameObject.prototype.bounds = function bounds() {
    // TODO: Also take care of scale
    // TODO: Also take care of rotation
    return new Rect(this.position.x, this.position.y, this.width, this.height);
  };

  GameObject.prototype.addGameObject = function addGameObject() {
    // Add a game object to this game object
    this.queue.push(addable(GameObject, this.children).apply(this, arguments));
  };

  GameObject.prototype.addBehavior = function addBehavior() {
    // Add a `Behavior` instance to the the game object and update the `gameObject` property
    this.queue.push(addable(Behavior, this.children, function (child) {
      child.gameObject = this;
    }).apply(this, arguments));
  };

  GameObject.prototype.addModel = function addModel() {
    // Add a `Model` instance to the game object
    this.queue.push(addable(Model, this.children).apply(this, arguments));
  };

  GameObject.prototype.removeGameObject = function removeGameObject() {};

  GameObject.prototype.removeBehavior = function removeBehavior() {};

  GameObject.prototype.removeModel = function removeModel() {};

  GameObject.prototype.data = function data(name) {
    if (!name) {
      return this.models.byName("default");
    } else {
      return this.models.byName(name);
    }
  };

  GameObject.prototype.animate = function animate(property, end, time, callback) {
    // TODO: Tweening does not work yet
    if (typeof this[property] === "number") {
      var distance = end - this[property];
      var timeInS = time / 1000;

      var animateName = "animate-" + Date.now();
      this.on(animateName, function (dt) {
        this.off(animateName);
      });
    }
  };

  GameObject.fromString = function fromString() {};

  _prototypeProperties(GameObject, null, {
    left: {
      get: function () {
        return this.position.x;
      },
      set: function (value) {
        this.position.x = value;
      },
      configurable: true
    },
    top: {
      get: function () {
        return this.position.y;
      },
      set: function (value) {
        this.position.y = value;
      },
      configurable: true
    },
    right: {
      get: function () {
        return this.parent.width - this.width - this.position.x;
      },
      set: function (value) {
        this.position.x = this.parent.width - this.width - value;
      },
      configurable: true
    },
    bottom: {
      get: function () {
        return this.parent.height - this.height - this.position.y;
      },
      set: function (value) {
        this.position.y = this.parent.height - this.height - value;
      },
      configurable: true
    }
  });

  return GameObject;
})(Base);

serializable(GameObject);
storable(GameObject);

module.exports = GameObject;
//# sourceMappingURL=gameobject.js.map