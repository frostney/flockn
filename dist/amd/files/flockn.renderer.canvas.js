define('flockn/renderer/canvas', ['exports', 'module', '../types', '../graphics', '../graphics/rootelement', '../input/mouse'], function (exports, module, _types, _graphics, _graphicsRootelement, _inputMouse) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Graphics = _interopRequire(_graphics);

  var _createRootElement = _interopRequire(_graphicsRootelement);

  var factory = function factory() {
    _Graphics.renderer = 'Canvas';

    var rootElement = null;
    var context = null;

    _Graphics.on('initialize', function (Game) {
      rootElement = _createRootElement.call(Game, 'canvas', function (rootElement) {
        rootElement.width = Game.width;
        rootElement.height = Game.height;
        context = rootElement.getContext('2d');
      });

      _inputMouse.events.forEach(function (eventName) {
        rootElement.addEventListener(eventName, function (e) {
          if (Game.activeScene) {
            Game.activeScene.children.all(function (obj) {
              return obj.visible && obj.bounds().contains(_inputMouse.relativePosition(e, rootElement, obj));
            }).forEach(function (obj) {
              return obj.trigger(eventName, _inputMouse.relativePosition(e, rootElement, obj));
            });
          }
        });
      });
    });

    _Graphics.before('render', function (obj) {
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

    _Graphics.on('render', function (obj) {
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

  module.exports = factory;
});
