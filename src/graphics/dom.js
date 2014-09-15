udefine(['../graphics'], function(Graphics) {

  Graphics.init = function(container, width, height) {
    Graphics.renderer = 'DOM';

    if (container.indexOf('#') === 0) {
      container = container.slice(1);
    }

    width = width || 600;
    height = height || 480;

    Graphics.container = container;
    Graphics.element = document.getElementById(container);

    if (Graphics.element == null) {
      var element = document.createElement('div');
      element.id = container;
      document.body.appendChild(element);

      Graphics.element = element;
    }
  };

  Graphics.on('add', function(obj) {
    // Remove previous elements of the same id
    if (document.getElementById(obj.name) != null) {

    }

    var parent = obj.parent;

    var parentElem = (function() {
      if ((parent && parent.isRoot) || parent == null) {
        return Graphics.element;
      } else {
        var element = document.getElementById(obj.parent);
        if (element == null) {
          return Graphics.element;
        } else {
          return element;
        }
      }
    })();

    /*if (parent == null) {
      console.warn('Parent (' + obj.parent.name + ') for object (' + obj.name + ') does not exist. Aborting render call for this object.');
      return;
    }*/

    var element = document.createElement('div');
    element.id = obj.id.toLowerCase();
    element.className = [obj.type.toLowerCase(), obj.name.toLowerCase()].join(' ');
    element.style.position = 'absolute';

    switch (obj.type) {
    case 'Scene':
      break;
    case 'GameObject':
      element.style.left = obj.x + 'px';
      element.style.top = obj.y + 'px';
      break;
    default:
      break;
    }

    parentElem.appendChild(element);
  });

  Graphics.on('render', function(obj) {
    // Update element attributes

    switch (obj.type) {
    case 'GameObject':
      break;
    default:
      break;
    }

  });

  return Graphics;

});
