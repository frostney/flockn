'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _types = require('../types');

var _graphics = require('../graphics');

var _graphics2 = _interopRequireDefault(_graphics);

var _graphicsRootelement = require('../graphics/rootelement');

var _graphicsRootelement2 = _interopRequireDefault(_graphicsRootelement);

var _inputMouse = require('../input/mouse');

var mouse = _interopRequireWildcard(_inputMouse);

var factory = function factory() {
  _graphics2['default'].renderer = 'Canvas';

  var rootElement = null;
  var context = null;

  _graphics2['default'].on('initialize', function (Game) {
    rootElement = _graphicsRootelement2['default'].call(Game, 'canvas', function (rootElement) {
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

  _graphics2['default'].before('render', function (obj) {
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

  _graphics2['default'].on('render', function (obj) {
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