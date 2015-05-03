'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Vector2 = require('../types');

var _Graphics = require('../graphics');

var _Graphics2 = _interopRequireWildcard(_Graphics);

var _createRootElement = require('../graphics/rootelement');

var _createRootElement2 = _interopRequireWildcard(_createRootElement);

var _import = require('../input/mouse');

var mouse = _interopRequireWildcard(_import);

var factory = function factory() {
  _Graphics2['default'].renderer = 'Canvas';

  var rootElement = null;
  var context = null;

  _Graphics2['default'].on('initialize', function (Game) {
    rootElement = _createRootElement2['default'].call(Game, 'canvas', function (rootElement) {
      rootElement.width = Game.width;
      rootElement.height = Game.height;
      context = rootElement.getContext('2d');
    });

    mouse.events.forEach(function (eventName) {
      rootElement.addEventListener(eventName, function (e) {
        if (Game.activeScene) {
          Game.activeScene.children.all(function (obj) {
            return obj.visible && obj.bounds().contains(mouse.relativePosition(e, rootElement, obj));
          }).forEach(function (obj) {
            return obj.trigger(eventName, mouse.relativePosition(e, rootElement, obj));
          });
        }
      });
    });
  });

  _Graphics2['default'].before('render', function (obj) {
    switch (obj.type) {
      case 'Game':
        context.clearRect(0, 0, obj.width, obj.height);

        context.fillStyle = obj.color.toString();
        context.fillRect(0, 0, obj.width, obj.height);
        break;
      default:
        break;
    }
  });

  _Graphics2['default'].on('render', function (obj) {
    switch (obj.type) {
      case 'GameObject':
        context.save();

        context.translate(obj.position.x + obj.origin.x, obj.position.y + obj.origin.y);

        if (obj.angle !== 0) {
          context.rotate(obj.angle * (Math.PI / 180));
        }

        if (obj.texture.backgroundColor.toString() !== 'transparent') {
          context.fillStyle = obj.texture.backgroundColor.toString();
          context.fillRect(-obj.origin.x, -obj.origin.y, obj.width, obj.height);
        }

        if (obj.texture.image.drawable) {
          context.drawImage(obj.texture.image.data, -obj.origin.x, -obj.origin.y);
        }

        if (obj.texture.label.drawable) {
          var fontName = obj.texture.label.font.size + 'px ' + obj.texture.label.font.name;

          context.fillStyle = obj.texture.label.font.color.toString();
          context.fillText(obj.texture.label.text, -obj.origin.x, -obj.origin.y);
        }

        context.restore();
        break;
      case 'Scene':
        if (obj.parent.activeScene !== obj.name) {
          return;
        }
        break;
      default:
        break;
    }
  });
};

exports['default'] = factory;
module.exports = exports['default'];
//# sourceMappingURL=canvas.js.map