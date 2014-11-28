(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/renderer/canvas', ["exports", "flockn/types", "flockn/graphics", "flockn/graphics/rootelement", "flockn/input/mouse"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("flockn/types"), require("flockn/graphics"), require("flockn/graphics/rootelement"), require("flockn/input/mouse"));
  }
})(function (exports, _flocknTypes, _flocknGraphics, _flocknGraphicsRootelement, _flocknInputMouse) {
  "use strict";

  var Vector2 = _flocknTypes.Vector2;
  var Graphics = _flocknGraphics.default;
  var createRootElement = _flocknGraphicsRootelement.default;
  var mouse = _flocknInputMouse;


  Graphics.renderer = "Canvas";

  var rootElement = null;
  var context = null;

  Graphics.on("initialize", function (Game) {
    rootElement = createRootElement.call(Game, "canvas", function (rootElement) {
      rootElement.width = Game.width;
      rootElement.height = Game.height;
      context = rootElement.getContext("2d");
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

  Graphics.before("render", function (obj) {
    switch (obj.type) {
      case "Game":
        context.clearRect(0, 0, obj.width, obj.height);

        context.fillStyle = obj.color.toString();
        context.fillRect(0, 0, obj.width, obj.height);
        break;
      default:
        break;
    }
  });

  Graphics.on("render", function (obj) {
    switch (obj.type) {
      case "GameObject":
        context.save();

        context.translate(obj.position.x + obj.origin.x, obj.position.y + obj.origin.y);

        if (obj.angle !== 0) {
          context.rotate(obj.angle * (Math.PI / 180));
        }

        if (obj.texture.color.toString() !== "transparent") {
          context.fillStyle = obj.texture.color.toString();
          context.fillRect(-obj.origin.x, -obj.origin.y, obj.width, obj.height);
        }

        if (obj.texture.image.drawable) {
          context.drawImage(obj.texture.image.data, -obj.origin.x, -obj.origin.y);
        }

        if (obj.texture.label.drawable) {
          var fontName = obj.texture.label.font.size + "px " + obj.texture.label.font.name;

          context.fillStyle = obj.texture.label.font.color.toString();
          context.fillText(obj.texture.label.text, -obj.origin.x, -obj.origin.y);
        }

        context.restore();
        break;
      case "Scene":
        if (obj.parent.activeScene !== obj.name) {
          return;
        }
        break;
      default:
        break;
    }
  });
});