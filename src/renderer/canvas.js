udefine(['../graphics', '../graphics/rootelement'], function(Graphics, createRootElement) {
  'use strict';

  Graphics.renderer = 'Canvas';

  var rootElement = null;
  var context = null;

  Graphics.on('initialize', function(Game) {
    rootElement = createRootElement.call(this, 'canvas', function(rootElement) {
      context = rootElement.getContext('2d');
    });
  });

  Graphics.before('render', function(obj) {
    switch (obj.type) {
    case 'Game':
      context.clearRect(0, 0, obj.width, obj.height);
      break;
    default:
      break;
    }
  });

  Graphics.on('render', function(obj) {
    switch (obj.type) {
    case 'GameObject':
    	if (obj.texture.image.filename) {
    		
    	}
    	
    	if (obj.texture.label.text) {
    		
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
