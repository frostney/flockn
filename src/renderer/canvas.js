import Graphics from 'flockn/graphics'
import createRootElement from 'flockn/graphics/rootelement'

Graphics.renderer = 'Canvas';

var rootElement = null;
var context = null;

Graphics.on('initialize', function(Game) {
  rootElement = createRootElement.call(Game, 'canvas', function(rootElement) {
    rootElement.width = Game.width;
    rootElement.height = Game.height;
    context = rootElement.getContext('2d');
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

    context.translate(obj.x + obj.origin.x, obj.y + obj.origin.y);

    if (obj.angle !== 0) {
      context.rotate(obj.angle * (Math.PI / 180));
    }

    if (obj.texture.color.toString() !== 'transparent') {
      context.fillStyle = obj.texture.color.toString();
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
