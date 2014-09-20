udefine(['../graphics', '../graphics/rootelement'], function(Graphics, createRootElement) {
  'use strict';

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
      
      context.fillStyle = obj.color;
      context.fillRect(0, 0, obj.width, obj.height);
      break;
    default:
      break;
    }
  });

  Graphics.on('render', function(obj) {
    switch (obj.type) {
    case 'GameObject':
      if (obj.color !== 'transparent') {
        context.fillStyle = obj.color;
        context.fillRect(obj.x, obj.y, obj.width, obj.height);
      }

      if (obj.texture.image.drawable) {
        context.drawImage(obj.texture.image.data, obj.x, obj.y);
      }

      if (obj.texture.label.drawable) {

      }
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

});
