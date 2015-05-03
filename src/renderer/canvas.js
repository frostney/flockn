import {Vector2} from '../types';
import Graphics from '../graphics';
import createRootElement from '../graphics/rootelement';
import * as mouse from '../input/mouse';

Graphics.renderer = 'Canvas';

var rootElement = null;
var context = null;

Graphics.on('initialize', function(Game) {
  rootElement = createRootElement.call(Game, 'canvas', function(rootElement) {
    rootElement.width = Game.width;
    rootElement.height = Game.height;
    context = rootElement.getContext('2d');
  });

  mouse.events.forEach(function(eventName) {
    rootElement.addEventListener(eventName, function(e) {
      if (Game.activeScene) {
        Game.activeScene.children
          .all(obj => obj.visible && obj.bounds().contains(mouse.relativePosition(e, rootElement, obj)))
          .forEach(obj => obj.trigger(eventName, mouse.relativePosition(e, rootElement, obj)));
      }
    });
  });
});

Graphics.before('render', function(obj) {
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

Graphics.on('render', function(obj) {
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
