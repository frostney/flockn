udefine(['../graphics'], function(Graphics) {

  var pixelize = function(num) {
    return num + 'px';
  };

  var unpixelize = function(str) {
    return parseFloat(str) || 0;
  };

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

    Graphics.element.style.width = pixelize(width);
    Graphics.element.style.height = pixelize(height);

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
        var parentId = obj.parent.id.toLowerCase();
        var element = document.getElementById(parentId);
        if (element == null) {
          return Graphics.element;
        } else {
          return element;
        }
      }
    })();

    var element = document.createElement('div');
    element.id = obj.id.toLowerCase();
    element.className = [obj.type.toLowerCase(), obj.name.toLowerCase()].join(' ');
    element.style.position = 'absolute';

    switch (obj.type) {
    case 'Scene':
      break;
    case 'GameObject':
      element.style.left = pixelize(obj.x);
      element.style.top = pixelize(obj.y);
      element.style.width = pixelize(obj.width);
      element.style.height = pixelize(obj.height);
      break;
    default:
      break;
    }

    parentElem.appendChild(element);
  });

  Graphics.on('texture-loaded', function(obj, texture) {
    var element = document.getElementById(obj.id.toLowerCase());

    if (element != null) {
      element.style.backgroundImage = 'url(' + texture.filename + ')';
      element.style.width = pixelize(obj.width);
      element.style.height = pixelize(obj.height);
    }
  });

  Graphics.on('render', function(obj) {
    // Update element attributes
    var element = document.getElementById(obj.id.toLowerCase());

    if (element != null) {
      switch (obj.type) {
      case 'GameObject':
        var elemX = unpixelize(element.style.left);
        var elemY = unpixelize(element.style.top);
        var elemWidth = unpixelize(element.style.width);
        var elemHeight = unpixelize(element.style.height);

        if (elemX !== obj.x) {
          element.style.left = pixelize(obj.x);
        }

        if (elemY !== obj.y) {
          element.style.top = pixelize(obj.y);
        }

        if (elemWidth !== obj.width) {
          element.style.width = pixelize(obj.width);
        }

        if (elemHeight !== obj.height) {
          element.style.height = pixelize(obj.height);
        }
        
        // Set background color
        if (!obj.texture.filename) {
        	element.style.backgroundColor = obj.texture.color;
        }
        break;
      case 'Game':
      	break;
      default:
      	break;
      }

    }

  });

  return Graphics;

});
