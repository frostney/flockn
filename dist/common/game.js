'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Loop$AssetLoader = require('gamebox');

var _Base2 = require('./base');

var _Base3 = _interopRequireWildcard(_Base2);

var _Graphics = require('./graphics');

var _Graphics2 = _interopRequireWildcard(_Graphics);

var _Scene = require('./scene');

var _Scene2 = _interopRequireWildcard(_Scene);

var _Color = require('./types/color');

var _Color2 = _interopRequireWildcard(_Color);

var _Viewport = require('./viewport');

var _Viewport2 = _interopRequireWildcard(_Viewport);

var _addable$renderable$updateable$serializable = require('./mixins');

var root = window;

// Game is the entry point for all games made with flockn.
// Any number of `Scene` instances can be attached to a `Game` instance

var Game = (function (_Base) {
  function Game(descriptor) {
    var _this = this;

    _classCallCheck(this, Game);

    // Extend the `Base` class
    _Base.call(this, 'Game', descriptor);

    // `this.container` is a string, which is the id of the element.
    // If it's not given, it should create a new element. This should be handled by the renderer.
    this.container = null;

    // By default, the width and height of a `Game` instance will be as large as the inside of the browser window.
    this.width = root.innerWidth;
    this.height = root.innerHeight;
    this.color = new _Color2['default'](255, 255, 255);

    this.assetLoader = new _Loop$AssetLoader.AssetLoader();

    // Set the viewport object
    this.viewport = _Viewport2['default'];

    // `this.activeScene` is set to `null` by default, but will change to the instance of the scene
    // once a scene will be shown
    this.activeScene = null;

    // Trigger the graphics initializer
    this.on('execute', function () {
      console.log('eX');
      _Graphics2['default'].trigger('initialize', _this);
    });

    // A `Game` instance is the root element so the descriptor needs to be called directly,
    // because it won't be added to anywhere else
    this.call();

    // Mix in `renderable` and `updateable`
    _addable$renderable$updateable$serializable.renderable.call(this);
    _addable$renderable$updateable$serializable.updateable.call(this);

    // Bind the game loop to the `update` event
    _Loop$AssetLoader.Loop.on('update', function (dt) {
      // Deltatime should not be a millisecond value, but a second one.
      // It should be a value between 0 - 1
      _this.trigger('update', dt / 1000);
    });

    // Bind the game loop to the `render` event
    _Loop$AssetLoader.Loop.on('render', function () {
      _this.trigger('render');
    });

    // Add a `resize` event to each `Game` instance
    root.addEventListener('resize', function () {
      var newWidth = root.innerWidth;
      var newHeight = root.innerHeight;

      _this.trigger('resize', newWidth, newHeight);

      // Trigger resize event for the current scene
      var currentScene = _this.children.byName(_this.activeScene);

      if (currentScene) {
        currentScene.trigger('resize', root.innerWidth, root.innerHeight);
      }
    }, false);

    // Add an `orientationchange` event to each `Game` instance
    root.addEventListener('orientationchange', function () {
      _this.trigger('orientationchange');
    }, false);
  }

  _inherits(Game, _Base);

  Game.prototype.addScene = function addScene() {
    // When adding a scene, the dimension of scenes should be
    // exactly as large as the `Game` instance itself
    this.queue.push(_addable$renderable$updateable$serializable.addable(_Scene2['default'], this.children, function (child) {
      child.width = this.width;
      child.height = this.height;
    }).apply(this, arguments));
  };

  Game.prototype.showScene = function showScene(name) {
    // TODO: Add transitions
    this.children.forEach(function (scene) {
      return scene.visible = false;
    });

    // Set the `activeScene` property
    this.activeScene = this.children.byName(name);
    this.activeScene.visible = true;

    if (this.activeScene) {
      this.activeScene.trigger('resize', root.innerWidth, root.innerHeight);

      // Trigger the `show` event
      this.trigger('show', name, this.children[this.activeScene]);
    }
  };

  Game.prototype.preload = function preload(assets) {
    this.assetLoader.assets = assets;

    return this.assetLoader;
  };

  Game.prototype.run = function run(name) {
    var _this2 = this;

    _Graphics2['default'].trigger('add', this);

    this.on('executed', function () {
      // Start the game loop
      _Loop$AssetLoader.Loop.run();

      if (!name) {
        // If there's only no name, take the first scene
        if (_this2.children.length >= 1) {
          name = _this2.children.first().name;
        }
      }

      // Show the scene if a parameter has been specified
      _this2.showScene(name);
    });
  };

  return Game;
})(_Base3['default']);

_addable$renderable$updateable$serializable.serializable(Game);

exports['default'] = Game;
module.exports = exports['default'];
//# sourceMappingURL=game.js.map