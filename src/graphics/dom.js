udefine(['../graphics'], function(Graphics) {

  var pixelize = function(num) {
    return num + 'px';
  };

  var unpixelize = function(str) {
    return parseFloat(str) || 0;
  };
  
  Graphics.renderer = 'DOM';
  var rootElement = null;
  
  Graphics.on('initialize', function(Game) {
  	var containerName = (function() {
	  	if (Game.container == null) {
	  		return Game.container = Game.id;
	  	} else {
		  	if (Game.container.indexOf('#') === 0) {
		      return Game.container.slice(1);
		    }
	  	}
  	})();

    Game.width = Game.width || window.innerWidth;
    Game.height = Game.height || window.innerHeight;

    rootElement = document.getElementById(containerName);

    if (rootElement == null) {
      var element = document.createElement('div');
      element.id = containerName.toLowerCase();
      document.body.appendChild(element);

      rootElement = element;
    }
   	
   	rootElement.className = [Game.type.toLowerCase(), Game.name.toLowerCase()].join(' ');

		rootElement.style.position = 'absolute';
    rootElement.style.width = pixelize(Game.width);
    rootElement.style.height = pixelize(Game.height);
    rootElement.style.backgroundColor = Game.color;
    rootElement.style.overflow = 'hidden';
    
    if (Game.width < window.innerWidth) {
    	rootElement.style.left = '50%';
    	rootElement.style.marginLeft = (Game.width * (-0.5)) + 'px';
    }
    
    if (Game.height < window.innerHeight) {
    	rootElement.style.top = '50%';
    	rootElement.style.marginTop = (Game.width * (-0.5)) + 'px';
    }
  });

  Graphics.on('add', function(obj) {
  	var elementId = obj.id.toLowerCase();
  	
    // Remove previous elements of the same id
    if (document.getElementById(elementId) != null) {
    	(function() {
				var parentId = obj.parent.id.toLowerCase();
				
				var parentElem = document.getElementById(parentId);
				parentElem.removeChild(document.getElementId(elementId));
    	})();
    }

    var parent = obj.parent;

    var parentElem = (function() {
      if ((parent && parent.isRoot) || parent == null) {
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
      	var elemVisible = element.style.display === 'block';
      	
      	if (elemVisible !== obj.visible) {
      		element.style.display = (obj.visible) ? 'block' : 'hidden';
      	}
      
      	if (!elemVisible) {
      		return;
      	}
      
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
        
        if (obj.angle) {
        	element.style.transform = 'rotate(' + obj.angle + 'deg)';
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
