'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Base2 = require('./base');

var _Base3 = _interopRequireWildcard(_Base2);

var _Behavior = require('./behavior');

var _Behavior2 = _interopRequireWildcard(_Behavior);

var _Graphics = require('./graphics');

var _Graphics2 = _interopRequireWildcard(_Graphics);

var _Group = require('./group');

var _Group2 = _interopRequireWildcard(_Group);

var _Model = require('./model');

var _Model2 = _interopRequireWildcard(_Model);

var _serialize = require('./serialize');

var _serialize2 = _interopRequireWildcard(_serialize);

var _Texture = require('./texture');

var _Texture2 = _interopRequireWildcard(_Texture);

var _Vector2$Vector3$Color$Rect = require('./types');

var _addable$renderable$updateable$serializable = require('./mixins');

var GameObject = (function (_Base) {
  function GameObject(descriptor) {
    var _this = this;

    _classCallCheck(this, GameObject);

    _Base.call(this, 'GameObject', descriptor);

    this.visible = true;

    this.position = new _Vector2$Vector3$Color$Rect.Vector3();

    this.fitToTexture = true;

    // Create a new texture and bind it to the `texture` property
    this.texture = new _Texture2['default']();
    this.texture.parent = this;

    // Once the image is loaded, update width and height if `fitToTexture` is set
    this.texture.on('image-loaded', function () {
      if (_this.fitToTexture) {
        _this.width = _this.texture.image.width;
        _this.height = _this.texture.image.height;

        _this.origin.x = _this.width / 2;
        _this.origin.y = _this.height / 2;
      }

      // TODO: Evaluate if the Graphics trigger should only be in the texture
      _Graphics2['default'].trigger('texture-image-loaded', _this, _this.texture);
    });

    // Once the label is loaded, update width and height if `fitToTexture` is set
    this.texture.on('label-loaded', function () {
      if (_this.fitToTexture) {
        _this.width = _this.texture.label.width;
        _this.height = _this.texture.label.height;

        _this.origin.x = _this.width / 2;
        _this.origin.y = _this.height / 2;

        // TODO: Evaluate if the Graphics trigger should only be in the texture
        _Graphics2['default'].trigger('texture-label-loaded', _this, _this.texture);
      }
    });

    this.width = 0;
    this.height = 0;

    this.angle = 0;

    this.alpha = 1;

    this.scale = new _Vector2$Vector3$Color$Rect.Vector2(1, 1);

    this.origin = new _Vector2$Vector3$Color$Rect.Vector2(this.width / 2, this.width / 2);

    this.border = {
      width: 0,
      color: new _Vector2$Vector3$Color$Rect.Color(),
      radius: 0
    };

    // Add default model
    var defaultModel = new _Model2['default']();
    defaultModel.name = 'default';

    this.addModel(defaultModel);

    // Mix in renderable and updateable
    _addable$renderable$updateable$serializable.renderable.call(this);
    _addable$renderable$updateable$serializable.updateable.call(this);
  }

  _inherits(GameObject, _Base);

  GameObject.prototype.bounds = function bounds() {
    // TODO: Also take care of scale
    // TODO: Also take care of rotation
    return new _Vector2$Vector3$Color$Rect.Rect(this.position.x, this.position.y, this.width, this.height);
  };

  GameObject.prototype.addGameObject = function addGameObject() {
    // Add a game object to this game object
    this.queue.push(_addable$renderable$updateable$serializable.addable(GameObject, this.children).apply(this, arguments));
  };

  GameObject.prototype.addBehavior = function addBehavior() {
    // Add a `Behavior` instance to the the game object and update the `gameObject` property
    this.queue.push(_addable$renderable$updateable$serializable.addable(_Behavior2['default'], this.children, function (child) {
      child.gameObject = this;
    }).apply(this, arguments));
  };

  GameObject.prototype.addModel = function addModel() {
    // Add a `Model` instance to the game object
    this.queue.push(_addable$renderable$updateable$serializable.addable(_Model2['default'], this.children).apply(this, arguments));
  };

  GameObject.prototype.removeGameObject = function removeGameObject() {};

  GameObject.prototype.removeBehavior = function removeBehavior() {};

  GameObject.prototype.removeModel = function removeModel() {};

  GameObject.prototype.data = function data(name) {
    if (!name) {
      return this.models.byName('default');
    } else {
      return this.models.byName(name);
    }
  };

  GameObject.prototype.animate = function animate(property, end, time, callback) {
    // TODO: Tweening does not work yet
    if (typeof this[property] === 'number') {
      var distance = end - this[property];
      var timeInS = time / 1000;

      var animateName = 'animate-' + Date.now();
      this.on(animateName, function (dt) {

        this.off(animateName);
      });
    }
  };

  GameObject.fromString = function fromString() {};

  _createClass(GameObject, [{
    key: 'left',
    get: function () {
      return this.position.x;
    },
    set: function (value) {
      this.position.x = value;
    }
  }, {
    key: 'top',
    get: function () {
      return this.position.y;
    },
    set: function (value) {
      this.position.y = value;
    }
  }, {
    key: 'right',
    get: function () {
      return this.parent.width - this.width - this.position.x;
    },
    set: function (value) {
      this.position.x = this.parent.width - this.width - value;
    }
  }, {
    key: 'bottom',
    get: function () {
      return this.parent.height - this.height - this.position.y;
    },
    set: function (value) {
      this.position.y = this.parent.height - this.height - value;
    }
  }]);

  return GameObject;
})(_Base3['default']);

_addable$renderable$updateable$serializable.serializable(GameObject);

exports['default'] = GameObject;
module.exports = exports['default'];
//# sourceMappingURL=gameobject.js.map