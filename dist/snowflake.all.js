udefine('snowflake/addable', ['./graphics'], function(Graphics) {
  'use strict';

  return function(Factory, groupInstance, extraFn) {

    var adder = function() {
      var child = arguments[0];
      var args = 2 <= arguments.length ? [].slice.call(arguments, 1) : [];

      if (!( child instanceof Factory)) {
        if ( typeof child === 'string') {
          if (Object.hasOwnProperty.call(store, child)) {
            child = new Factory(Factory.store[child]);
          }
        } else {
          child = new Factory(child);
        }
      }
      groupInstance.push(child);
      child.parent = this;

      if (extraFn) {
        extraFn.call(this, child);
      }

      Graphics.trigger('add', child);

      child.apply(args);
      child.trigger('add', child, args);
    };

    return function() {
      var args = [].slice.call(arguments);
      args.unshift(this);

      return adder.bind.apply(adder, args);
    };

  };
});

udefine('snowflake/base', ['eventmap', 'mixedice', 'gameboard/input', './group', './world'], function(EventMap, mixedice, Input, Group, World) {
  'use strict';
  
  var objectIndex = 0;
  
  var prependMax = 10000;
  
  var numToIdString = function(num) {
  	var stringNum = num + '';
  	
  	if (num >= prependMax) {
  		return stringNum;
  	} else {
  		var prependLength = (prependMax + '').length - stringNum.length;
  		for (var i = 0; i < prependLength; i++) {
  			stringNum = '0' + stringNum;
  		}
  		
  		return stringNum;
  	}
  };

  var Base = function(type, descriptor) {
    var self = this;

    mixedice([this, Base.prototype], new EventMap());

    type = type || 'Base';

    this.type = type;
    this.name = this.type + '-' + Date.now();
    
 		var currentObject = numToIdString(++objectIndex);
    
    Object.defineProperty(this, 'id', {
    	get: function() {
    		return this.type + '-' + currentObject;
    	},
    	enumerable: true
    });
    
    this.descriptor = descriptor;

    this.children = new Group();
    
    this.queue = [];

    this.parent = null;
    
    this.input = Input;
    
    this.world = World;
    
    this.trigger('constructed');
  };

  Base.prototype.call = Base.prototype.reset = function() {
    this.apply(arguments);
  };

  Base.prototype.apply = function(args) {
  	// TODO: Reflect if function check should be enforced here
    if (this.descriptor) {
    	
      this.descriptor.apply(this, args);
      this.trigger('execute');
      
      // TODO: Impose an order in the queue, such as:
      // (Game) -> Scene -> GameObject -> Behavior
      this.queue.forEach(function(q) {
      	q && q();
      });
      this.queue = [];
    }
  };

  Base.extend = function(target, type, descriptor) {
    var base = new Base(type, descriptor);

    mixedice(target, base);
  };

  return Base;

});
udefine('snowflake/behavior', ['mixedice', './addable', './base', './group', './updateable'], function(mixedice, addable, Base, Group, updateable) {
	'use strict';

  var Behavior = function(descriptor) {
    Base.extend([this, Behavior.prototype], 'Behavior', descriptor);
    
    this.gameObject = null;
    
    updateable.call(this);
  };

  Behavior.prototype.addBehavior = function() {
    this.queue.push(addable(Behavior, this.children, function(child) {
    	child.gameObject = this.gameObject;
    }).apply(this, arguments));
  };


  Behavior.store = {};

  Behavior.define = function(name, factory) {
    Behavior.store[name] = factory;
  };

  return Behavior;
}); 
udefine('snowflake/game', ['root', 'mixedice', 'gameboard/loop', './addable', './base', './graphics', './scene', './renderable', './updateable'], function(root, mixedice, Loop, addable, Base, Graphics, Scene, renderable, updateable) {
	'use strict';
	
  var Game = function(descriptor) {
  	if (!this instanceof Game) {
  		return new Game(descriptor);
  	}
  	
  	var self = this;
  	
  	Base.extend([this, Game.prototype], 'Game', function() {
  		descriptor.call(this);
  		
  		Graphics.trigger('initialize', this);
  	});
  	
  	this.container = null;
  	this.width = root.innerWidth;
  	this.height = root.innerHeight;
  	this.color = 'rgb(255, 255, 255)';
  	
  	this.call();
  	
  	renderable.call(this);
  	updateable.call(this);
  	
  	Loop.on('update', function(dt) {
  		self.trigger('update', dt / 1000);
  	});
  	
  	Loop.on('render', function() {
  		self.trigger('render');
  	});
  	
  	root.addEventListener('resize', function() {
  		self.trigger('resize');
  	}, false);

    root.addEventListener('orientationchange', function() {
    	self.trigger('orientationchange');
    }, false);
  };
  
  Game.prototype.addScene = function() {
    this.queue.push(addable(Scene, this.children).apply(this, arguments));
  };
  
  Game.prototype.showScene = function(name) {
    this.activeScene = name;
    this.trigger('show', this.activeScene, this.children[this.activeScene]);
  };
  
  Game.prototype.run = function(name) {
  	Loop.run();
  	
  	if (name) {
  		this.showScene(name);
  	}
  };
  
  return Game;
});

udefine('snowflake/gameobject', ['mixedice', './addable', './base', './behavior', './graphics', './group', './renderable', './serialize', './texture', './updateable'], function(mixedice, addable, Base, Behavior, Graphics, Group, renderable, serialize, Texture, updateable) {
	'use strict';
	
  var GameObject = function(descriptor) {
    Base.extend([this, GameObject.prototype], 'GameObject', descriptor);
    
    var self = this;
    
    this.visible = true;
    
    this.x = 0;
    this.y = 0;
    
    this.texture = new Texture();
    this.texture.parent = this;
    this.texture.on('loaded', function() {
    	self.width = self.texture.data.width;
    	self.height = self.texture.data.height;
    	
    	// TODO: Evaluate if the Graphics trigger should only be in the texture
    	Graphics.trigger('texture-loaded', self, self.texture);
    });
    
    this.width = 0;
    this.height = 0;
    
    this.angle = 0;
    
    this.alpha = 1;
    
    this.scale = {
    	x: 1,
    	y: 1
    };
    
    // Behaviors
    this.behaviors = new Group();
    
    // Data models
    this.models = new Group();
    
    renderable.call(this);
    updateable.call(this);
    
    this.on('update', function() {
      self.behaviors.forEach(function(behavior) {
        behavior.trigger('update');
      });
    });
  };
  
  GameObject.store = {};
  
  GameObject.define = function(name, factory) {
    GameObject.store[name] = factory;
  };
  
  GameObject.prototype.addGameObject = function() {
    this.queue.push(addable(GameObject, this.children).apply(this, arguments));
  };
  
  GameObject.prototype.addBehavior = function() {
    this.queue.push(addable(Behavior, this.behaviors, function(child) {
    	child.gameObject = this;
    }).apply(this, arguments));
  };
  
  GameObject.prototype.toJSON = function() {
  	return serialize(this);
  };
  
  GameObject.prototype.fromJSON = function() {
  	
  };
  
  return GameObject;
});

udefine('snowflake/graphics', ['eventmap'], function(EventMap) {
	'use strict';
	
	var Graphics = new EventMap();
	
	return Graphics;
});

udefine('snowflake/graphics/rootelement', function() {
	'use strict';
	
	return function(elementName, extraFn) {
		var containerName = (function() {
	  	if (this.container == null) {
	  		return this.container = this.id;
	  	} else {
		  	if (this.container.indexOf('#') === 0) {
		      return this.container.slice(1);
		    }
	  	}
  	}).call(this);

    this.width = this.width || window.innerWidth;
    this.height = this.height || window.innerHeight;

    var rootElement = document.getElementById(containerName);

    if (rootElement == null) {
      var element = document.createElement(elementName);
      element.id = containerName.toLowerCase();
      document.body.appendChild(element);

      rootElement = element;
    }
   	
   	rootElement.className = [this.type.toLowerCase(), this.name.toLowerCase()].join(' ');

		rootElement.style.position = 'absolute';
    rootElement.style.width = this.width + 'px';
    rootElement.style.height = this.height + 'px';
    
    extraFn.call(this, rootElement);
    
    if (this.width < window.innerWidth) {
    	rootElement.style.left = '50%';
    	rootElement.style.marginLeft = (this.width * (-0.5)) + 'px';
    }
    
    if (this.height < window.innerHeight) {
    	rootElement.style.top = '50%';
    	rootElement.style.marginTop = (this.width * (-0.5)) + 'px';
    }
    
    return rootElement;
	};
});

udefine('snowflake/group', ['./serialize'], function(serialize) {
	'use strict';
	
  var unidentified = 'untitled';
  var unidentifiedCounter = 0;

  var Group = function() {
    this.length = 0;

    this.tags = {};
    this.names = {};
  };

  Group.prototype.push = function(obj, tags) {    
    var name = obj.name || (unidentified + unidentifiedCounter++);
    if (tags == null) {
      tags = obj.tags || [];      
    }

    if (Object.hasOwnProperty.call(this.names, name)) {
      return;
    }
    
    this[this.length] = obj;
    
    Object.keys(this.tags).forEach(function(tag) {
      this.tags[tag] = this.tags[tag] || [];
      this.tags[tag].push(this.length);
    }, this);
    
    this.names[name] = this.length;

    return ++this.length;
  };
  
  // TODO: Behavior currently stays in the list
  Group.prototype.pop = function() {    
    return this[this.length];
  };

  Group.prototype.splice = function(index, how) {
    
  };
  
  Group.prototype.slice = function(begin, end) {
    if (end == null) {
      end = this.length;
    }
    
    var slicedGroup = new Group();
    
    for (var i = begin; i < end; i++) {
      slicedGroup.push(this[i]);
    }
    
    return slicedGroup;
  };
  
  Group.prototype.forEach = function(callback) {
    for (var i = 0; i < this.length; i++) {
      callback(this[i]);
    }
  };
  
  // TODO: Evaluate if Group#map and Group#filter should rather return a Group instance than an array
  Group.prototype.map = function(callback) {
  	var mappedArray = [];
    
    for (var i = 0; i < this.length; i++) {
      mappedArray.push(callback(this[i]));
    }
    
    return mappedArray;
  };
  
  Group.prototype.filter = function(callback) {
    var filteredArray = [];
    
    for (var i = 0; i < this.length; i++) {
      if (callback(this[i])) {
        filteredArray.push(this[i]);
      }
    }
    
    return filteredArray;
  };
  
  Group.prototype.byName = function(name) {
    return this[this.names[name]];
  };
  
  Group.prototype.byTag = function(tag) {
    return this.tags[tag].map(function(index) {
      return this[index];
    }, this);
  };
  
  Group.prototype.toJSON = function() {
  	return serialize(this);
  };

  return Group;
});

udefine('snowflake/renderable', ['./graphics'], function(Graphics) {
	'use strict';
	
	return function() {
		var self = this;
		
		this.on('render', function() {
    	Graphics.trigger('render', self);
    	
      self.children.forEach(function(child) {
        child.trigger('render');
      });
    });
	};
});

udefine('snowflake/renderer/canvas', ['../graphics', '../graphics/rootelement'], function(Graphics, createRootElement) {
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

udefine('snowflake/renderer/dom', ['root', '../graphics', '../graphics/rootelement'], function(root, Graphics, createRootElement) {
  'use strict';

  var pixelize = function(num) {
    return num + 'px';
  };

  var unpixelize = function(str) {
    return parseFloat(str) || 0;
  };

  Graphics.renderer = 'DOM';

  var rootElement = null;

  Graphics.on('initialize', function(Game) {
    rootElement = createRootElement.call(Game, 'div', function(rootElement) {
      rootElement.style.backgroundColor = this.color;
      rootElement.style.overflow = 'hidden';
    });
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
      
      root.addEventListener('click', function() {
      	
      }, true);
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
          element.style.transform = element.style.mozTransform = element.style.webkitTransform = 'rotate(' + obj.angle + 'deg)';
        }

        if (obj.alpha !== 1) {
          element.style.opacity = obj.alpha;
        }

        // Set background color
        if (!obj.texture.filename) {
          element.style.backgroundColor = obj.texture.color;
        } else {
          if (obj.texture.offset.x !== 0) {
            element.style.backgroundPositionX = obj.texture.offset.x * (-1) + 'px';
          }

          if (obj.texture.offset.y !== 0) {
            element.style.backgroundPositionY = obj.texture.offset.y * (-1) + 'px';
          }
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

  return Graphics;

});

udefine('snowflake/scene', ['mixedice', './addable', './base', './group', './gameobject', './renderable', './updateable'], function(mixedice, addable, Base, Group, GameObject, renderable, updateable) {
  'use strict';
  
  var Scene = function(descriptor) {
    Base.extend([this, Scene.prototype], 'Scene', descriptor);
    
    renderable.call(this);
    updateable.call(this);
  };
  
  Scene.prototype.addGameObject = function() {
    this.queue.push(addable(GameObject, this.children).apply(this, arguments));
  };
  
  Scene.store = {};
  
  Scene.define = function(name, factory) {
    Scene.store[name] = factory;
  };
  
  return Scene;
  
});

udefine('snowflake/serialize', function() {
	'use strict';
	
  return function(obj) {
    return JSON.stringify(obj, function(key, value) {
      // Avoiding cyclic dependencies
      if (key === 'parent') {
        return;
      }

      // Stringify the descriptor
      if (key === 'descriptor') {
        value = value.toString();
      }

      return value;
    });
  };
});

udefine('snowflake/texture', ['mixedice', 'eventmap'], function(mixedice, EventMap) {
	'use strict';
	
	var Texture = function() {
		mixedice([this, Texture.prototype], new EventMap());
		
		var self = this;
		
		var filename = '';
		
		this.width = 0;
		this.height = 0;
		
		this.data = null;
		
		this.parent = null;
		
		this.offset = {
			x: 0,
			y: 0
		};
		
		Object.defineProperty(this, 'filename', {
			get: function() {
				return filename;
			},
			set: function(value) {
				filename = value;
				
				// TODO: Most of this should already be handled by the preloader
				var img = new Image();
				img.src = filename;
				
				img.onload = function() {
					self.data = img;
					self.trigger('loaded');
				};
			},
			enumerable: true
		});
		
		this.color = 'rgb(255, 255, 255)';
		
	};
	
	return Texture;
});

udefine('snowflake/updateable', function() {
	'use strict';
	
	return function() {
		var self = this;
		
		this.on('update', function(dt) {
      self.children.forEach(function(child) {
        child.trigger('update', dt);
      });
    });
	};
});

udefine('snowflake/world', ['eventmap'], function(EventMap) {
	'use strict';
	
	var events = new EventMap();
	var World = {};
	var data = {};
	
	World.get = function(name) {
		if (Object.hasOwnProperty.call(data, name)) {
			return data[name];
		}
	};
	
	World.set = function(name, value) {
		data[name] = value;
		World.trigger('change', name, value);
	};
	
	World.on = events.on;
	World.off = events.off;
	World.before = events.before;
	World.after = events.after;
	World.trigger = events.trigger;
	
	return World;
});
