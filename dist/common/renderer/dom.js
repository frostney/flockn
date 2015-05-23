'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _graphics = require('../graphics');

var _graphics2 = _interopRequireDefault(_graphics);

var _graphicsRootelement = require('../graphics/rootelement');

var _graphicsRootelement2 = _interopRequireDefault(_graphicsRootelement);

var _inputMouse = require('../input/mouse');

var mouse = _interopRequireWildcard(_inputMouse);

var factory = function factory() {
  var root = window;

  var pixelize = function pixelize(num) {
    return num + 'px';
  };

  var unpixelize = function unpixelize(str) {
    return parseFloat(str) || 0;
  };

  _graphics2['default'].renderer = 'DOM';

  var rootElement = null;

  _graphics2['default'].on('initialize', function (Game) {
    rootElement = _graphicsRootelement2['default'].call(Game, 'div', function (rootElement) {
      rootElement.style.backgroundColor = this.color.toString();
      rootElement.style.overflow = 'hidden';
      rootElement.style.cursor = 'default';
      rootElement.style.userSelect = rootElement.style.mozUserSelect = rootElement.style.webkitUserSelect = 'none';
    });
  });

  _graphics2['default'].on('add', function (obj) {
    // TODO: Models shouldn't be added to the DOM. Currently we do a check if has an id, but sometime in the
    //  future they might have
    if (!obj.id) {
      return;
    }

    var elementId = obj.id.toLowerCase();

    // Remove previous elements of the same id
    if (document.getElementById(elementId) != null) {
      (function () {
        var parentId = obj.parent.id.toLowerCase();

        var parentElem = document.getElementById(parentId);
        parentElem.removeChild(document.getElementById(elementId));
      })();
    }

    var parent = obj.parent;

    var parentElem = (function () {
      if (parent && parent.isRoot || parent == null) {
        return rootElement;
      } else {
        var parentId = obj.parent.id.toLowerCase();
        var element = document.getElementById(parentId);
        if (element == null) {
          return rootElement;
        } else {
          return element;
        }
      }
    })();

    var element = document.createElement('div');
    element.id = elementId;
    element.className = [obj.type.toLowerCase(), obj.name.toLowerCase()].join(' ');
    element.style.position = 'absolute';

    switch (obj.type) {
      case 'Scene':
        element.style.width = pixelize(obj.parent.width);
        element.style.height = pixelize(obj.parent.height);
        break;
      case 'GameObject':
        element.style.left = pixelize(obj.position.x);
        element.style.top = pixelize(obj.position.y);
        element.style.width = pixelize(obj.width);
        element.style.height = pixelize(obj.height);

        mouse.events.forEach(function (eventName) {
          root.addEventListener(eventName, function (evt) {
            obj.trigger(mouse.relativePosition(evt, rootElement, obj));
          });
        });

        // Mouseenter and Mouseleave are kinda special right now
        root.addEventListener('mouseenter', function (evt) {
          obj.trigger('mouseenter', evt);
        }, true);

        root.addEventListener('mouseleave', function (evt) {
          obj.trigger('mouseleave', evt);
        }, true);

        break;
      default:
        break;
    }

    parentElem.appendChild(element);
  });

  _graphics2['default'].on('texture-image-loaded', function (obj, texture) {
    var element = document.getElementById(obj.id.toLowerCase());

    if (element != null) {
      element.style.backgroundImage = 'url(' + texture.image.filename + ')';
      element.style.width = pixelize(obj.width);
      element.style.height = pixelize(obj.height);
    }
  });

  _graphics2['default'].on('texture-label-loaded', function (obj, texture) {
    var element = document.getElementById(obj.id.toLowerCase());

    if (element != null) {
      element.style.width = pixelize(obj.width);
      element.style.height = pixelize(obj.height);
    }
  });

  var dirtyObjects = {};

  _graphics2['default'].after('render', function (obj) {
    var objId = obj.id.toLowerCase();

    dirtyObjects[objId] = obj;
  });

  _graphics2['default'].on('render', function (obj) {
    var objId = obj.id.toLowerCase();

    // Update element attributes
    var element = document.getElementById(objId);

    if (element != null) {
      var prevObj = dirtyObjects[objId] || {};

      switch (obj.type) {
        case 'GameObject':
          var elemVisible = element.style.display === 'block';

          if (elemVisible !== obj.visible) {
            element.style.display = obj.visible ? 'block' : 'hidden';
          }

          if (!elemVisible) {
            return;
          }

          var elemX = unpixelize(element.style.left);
          var elemY = unpixelize(element.style.top);
          var elemWidth = unpixelize(element.style.width);
          var elemHeight = unpixelize(element.style.height);

          if (elemX !== obj.position.x) {
            element.style.left = pixelize(obj.position.x);
          }

          if (elemY !== obj.position.y) {
            element.style.top = pixelize(obj.position.y);
          }

          if (elemWidth !== obj.width) {
            element.style.width = pixelize(obj.width);
          }

          if (elemHeight !== obj.height) {
            element.style.height = pixelize(obj.height);
          }

          if (obj.angle) {
            element.style.transform = element.style.mozTransform = element.style.webkitTransform = 'rotate(' + obj.angle + 'deg)';
          }

          if (obj.alpha !== 1) {
            element.style.opacity = obj.alpha;
          }

          // Set background color
          element.style.backgroundColor = obj.texture.backgroundColor.toString();

          // Set origin
          element.style.transformOrigin = element.style.mozTransformOrigin = element.webkitTransformOrigin = obj.origin.x + 'px ' + obj.origin.y + 'px';

          // Set border
          if (obj.border.width > 0) {
            element.style.borderWidth = pixelize(obj.border.width);
            element.style.borderStyle = 'solid';
            element.style.borderColor = obj.border.color.toString();

            if (obj.border.radius > 0) {
              element.style.borderRadius = pixelize(obj.border.radius);
            }
          }

          if (obj.texture.image.drawable) {
            if (obj.texture.image.offset.x !== 0) {
              element.style.backgroundPositionX = obj.texture.image.offset.x * -1 + 'px';
            }

            if (obj.texture.image.offset.y !== 0) {
              element.style.backgroundPositionY = obj.texture.image.offset.y * -1 + 'px';
            }
          }

          if (obj.texture.label.drawable) {
            element.innerText = obj.texture.label.text;

            element.style.whiteSpace = 'nowrap';

            if (obj.texture.label.font.size) {
              element.style.fontSize = pixelize(obj.texture.label.font.size);
            }

            if (obj.texture.label.font.color) {
              element.style.color = obj.texture.label.font.color.toString();
            }

            if (obj.texture.label.font.name) {
              element.style.fontFamily = obj.texture.label.font.name;
            }

            obj.texture.label.font.decoration.forEach(function (decoration) {
              switch (decoration) {
                case 'bold':
                  element.style.fontWeight = 'bold';
                  break;
                case 'italic':
                  element.style.fontStyle = 'italic';
                  break;
                case 'underline':
                  element.style.textDecoration = 'underline';
                  break;
                default:
                  break;
              }
            });
          }

          break;
        case 'Scene':
          var elemVisibleStyle = element.style.display;

          if (obj.parent.activeScene !== obj.name) {
            if (elemVisibleStyle !== 'hidden') {
              element.style.display = 'hidden';
            }
          } else {
            if (elemVisibleStyle !== 'block') {
              element.style.display = 'block';
            }
          }
          break;
        default:
          break;
      }
    }
  });
};

exports['default'] = factory;
module.exports = exports['default'];
//# sourceMappingURL=dom.js.map