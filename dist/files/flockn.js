udefine('flockn/addable', ['./graphics'], function(Graphics) {
  'use strict';

  return function(Factory, groupInstance, extraFn) {

    var adder = function() {
      var child = arguments[0];
      var args = 2 <= arguments.length ? [].slice.call(arguments, 1) : [];

      if (!( child instanceof Factory)) {
        if ( typeof child === 'string') {
          if (Object.hasOwnProperty.call(Factory.store, child)) {
            child = new Factory(Factory.store[child]);
          }
        } else {
          if ( typeof child === 'function') {
            child = new Factory(child);
          } else {
            // TODO: This should be also able to deep assign properties
            child = new Factory(function() {
              Object.keys(child).forEach(function(key) {
                this[key] = child[key];
              }, this);
            });
          }
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

define('flockn/assets', function() {
  
});

udefine('flockn/audio', function() {
  var Audio = {};
  
  Audio.play = function() {
    
  };
  
  return Audio;
});

udefine('flockn/base', ['eventmap', 'mixedice', 'gameboard/input', './audio', './group', './world'], function(EventMap, mixedice, Input, Audio, Group, World) {
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

    // Mix in an `EventMap` instance into `Base`
    mixedice([this, Base.prototype], new EventMap());

    type = type || 'Base';

    this.type = type;
    this.name = this.type + '-' + Date.now();

    // Count up `objectIndex` and stringify it
    var currentObject = numToIdString(++objectIndex);

    // The `id` property is read-only and returns the type and the stringified object index
    Object.defineProperty(this, 'id', {
      get: function() {
        return this.type + '-' + currentObject;
      },
      enumerable: true
    });

    // Save the descriptor
    this.descriptor = descriptor;

    // Create a new group for all children elements
    this.children = new Group();

    // Add a queue: All addable elements will be pushed into the queue first and called after everything else in
    // the `descriptor` has been called
    this.queue = [];

    this.parent = null;

    // `Input` should be available in instances derived from `Base`
    this.input = Input;

    // As should `Audio`...
    this.audio = Audio;

    // ...and `World`
    this.world = World;

    // Emit an event
    this.trigger('constructed');
  };
  
  Base.queueOrder = ['Game', 'Scene', 'GameObject', 'Behavior', 'Model'];

  Base.prototype.call = Base.prototype.reset = function() {
    // Call `Base#apply` with the arguments object
    this.apply(arguments);
  };

  Base.prototype.apply = function(args) {
    // TODO: Reflect if function check should be enforced here
    if (this.descriptor) {
      // If args is not an array or array-like, provide an empty one
      args = args || [];

      // Call the `descriptor` property with `args`
      this.descriptor.apply(this, args);
      
      // Trigger an event
      this.trigger('execute');

      // TODO: Impose an order in the queue, such as:
      // (Game) -> Scene -> GameObject -> Behavior -> Model
      
      // TODO: Implement z-order
      this.queue.forEach(function(q) {
        q && q();
      });
      
      // Reset the queue
      this.queue = [];
    }
  };
  
  Base.prototype.closest = function() {
    
  };
  
  Base.prototype.find = function() {
    
  };

  Base.prototype.log = function() {
    if (console && console.log) {
      var argArray = [].slice.call(arguments);

      // Log with `console.log`: Prepend the type and name
      argArray.unshift(':');
      argArray.unshift(this.name);
      argArray.unshift(this.type);

      return console.log.apply(console, argArray);
    }
  };

  // Shorthand function to derive from the Base object
  Base.extend = function(target, type, descriptor) {
    var base = new Base(type, descriptor);

    mixedice(target, base);
  };

  return Base;

}); 
udefine('flockn/behavior', ['mixedice', './addable', './base', './group', './updateable'], function(mixedice, addable, Base, Group, updateable) {
  'use strict';

  // Behaviors only provide logic. There is no rendering involved.
  // Behaviors can attach any number of behaviors to itself
  var Behavior = function(descriptor) {
    Base.extend([this, Behavior.prototype], 'Behavior', descriptor);

    // Reference to the game object itself
    this.gameObject = null;

    // Mix in `updateable`
    updateable.call(this);
  };

  Behavior.prototype.addBehavior = function() {
    // When a behavior is added, the reference to the game object is set
    this.queue.push(addable(Behavior, this.children, function(child) {
      child.gameObject = this.gameObject;
    }).apply(this, arguments));
  };
  
  Behavior.prototype.removeBehavior = function() {
    
  };

  // Behaviors can be defined and are stored on the object itself
  Behavior.store = {};

  Behavior.define = function(name, factory) {
    Behavior.store[name] = factory;
  };

  return Behavior;
});

define('flockn/constants/color', {
  aqua: {
    r: 0,
    g: 255,
    b: 255
  },
  black: {
    r: 0,
    g: 0,
    b: 0
  },
  blue: {
    r: 0,
    g: 0,
    b: 255
  },
  fuchsia: {
    r: 255,
    g: 0,
    b: 255
  },
  gray: {
    r: 128,
    g: 128,
    b: 128
  },
  green: {
    r: 0,
    g: 128,
    b: 0
  },
  lime: {
    r: 0,
    g: 255,
    b: 0
  },
  maroon: {
    r: 128,
    g: 0,
    b: 0
  },
  navy: {
    r: 0,
    g: 0,
    b: 128
  },
  olive: {
    r: 128,
    g: 128,
    b: 0
  },
  purple: {
    r: 128,
    g: 0,
    b: 128
  },
  red: {
    r: 255,
    g: 0,
    b: 0
  },
  silver: {
    r: 192,
    g: 192,
    b: 192
  },
  teal: {
    r: 0,
    g: 128,
    b: 128
  },
  white: {
    r: 255,
    g: 255,
    b: 255
  },
  yellow: {
    r: 255,
    g: 255,
    b: 0
  },
  transparent: {
    r: 0,
    g: 0,
    b: 0,
    a: 0
  }
}); 
udefine('flockn/game', ['root', 'mixedice', 'gameboard/loop', './addable', './base', './graphics', './scene', './renderable', './types/color', './updateable', './viewport'], function(root, mixedice, Loop, addable, Base, Graphics, Scene, renderable, Color, updateable, Viewport) {
  'use strict';

  // Game is the entry point for all games made with flockn.
  // Any number of `Scene` instances can be attached to a `Game` instance
  var Game = function(descriptor) {
    // The new operator does not need to be set explicitly.
    // If it isn't we return an instance of `Game`
    if (!this || !this instanceof Game) {
      return new Game(descriptor);
    }

    var self = this;

    // Extend the `Base` class
    Base.extend([this, Game.prototype], 'Game', function() {
      descriptor.call(this);

      Graphics.trigger('initialize', this);
    });

    // `this.container` is a string, which is the id of the element. 
    // If it's not given, it should create a new element. This should be handled by the renderer.
    this.container = null;
    
    // By default, the width and height of a `Game` instance will be as large as the inside of the browser window.
    this.width = root.innerWidth;
    this.height = root.innerHeight;
    this.color = new Color(255, 255, 255);
    
    // Set the viewport object
    this.viewport = Viewport;
    
    // `this.activeScene` is set to `null` by default, but will change once a scene will be shown
    this.activeScene = null;

    // A `Game` instance is the root element so the descriptor needs to be called directly, 
    // because it won't be added to anywhere else
    this.call();

    // Mix in `renderable` and `updateable`
    renderable.call(this);
    updateable.call(this);

    // Bind the game loop to the `update` event
    Loop.on('update', function(dt) {
      // Deltatime should not be a millisecond value, but a second one. 
      // It should be a value between 0 - 1
      self.trigger('update', dt / 1000);
    });

    // Bind the game loop to the `render` event
    Loop.on('render', function() {
      self.trigger('render');
    });

    // Add a `resize` event to each `Game` instance
    root.addEventListener('resize', function() {
      var newWidth = root.innerWidth;
      var newHeight = root.innerHeight;
      
      self.trigger('resize', newWidth, newHeight);
      
      // Trigger resize event for the current scene
      self.activeScene.trigger('resize', newWidth, newHeight);
    }, false);

    // Add an `orientationchange` event to each `Game` instance
    root.addEventListener('orientationchange', function() {
      self.trigger('orientationchange');
    }, false);
  };

  Game.prototype.addScene = function() {
    // When adding a scene, the dimension of scenes should be
    // exactly as large as the `Game` instance itself
    this.queue.push(addable(Scene, this.children, function(child) {
      child.width = this.width;
      child.height = this.height;
    }).apply(this, arguments));
  };

  Game.prototype.showScene = function(name) {
    // TODO: Add transitions
    
    // Set the `activeScene` property
    this.activeScene = name;
    
    // Call resize event
    this.activeScene.trigger('resize', root.innerWidth, root.innerHeight);
    
    // Trigger the `show` event
    this.trigger('show', this.activeScene, this.children[this.activeScene]);
  };
  
  Game.prototype.preload = function(assets) {
    
  };

  Game.prototype.run = function(name) {
    // Start the game loop
    Loop.run();

    if (!name) {
      // If there's only one scene, specifying a name is not necessary
      if (this.children.length === 1) {
        name = this.children[0].name;
      }
    }

    // Show the scene if a parameter has been specified
    if (name) {
      this.showScene(name);
    }
  };

  return Game;
});

udefine('flockn/gameobject', ['mixedice', './addable', './base', './behavior', './graphics', './group', './model', './renderable', './serialize', './texture', './updateable'], function(mixedice, addable, Base, Behavior, Graphics, Group, Model, renderable, serialize, Texture, updateable) {
  'use strict';

  var GameObject = function(descriptor) {
    Base.extend([this, GameObject.prototype], 'GameObject', descriptor);

    var self = this;

    this.visible = true;

    this.x = 0;
    this.y = 0;
    this.z = 0;

    Object.defineProperty(this, 'left', {
      get: function() {
        return this.x;
      },
      set: function(value) {
        this.x = value;
      },
      enumerable: true
    });

    Object.defineProperty(this, 'top', {
      get: function() {
        return this.y;
      },
      set: function(value) {
        this.y = value;
      },
      enumerable: true
    });

    Object.defineProperty(this, 'right', {
      get: function() {
        return this.parent.width - this.width - this.x;
      },
      set: function(value) {
        this.x = this.parent.width - this.width - value;
      },
      enumerable: true
    });

    Object.defineProperty(this, 'bottom', {
      get: function() {
        return this.parent.height - this.height - this.y;
      },
      set: function(value) {
        this.y = this.parent.height - this.height - value;
      },
      enumerable: true
    });

    this.fitToTexture = true;

    // Create a new texture and bind it to the `texture` property
    this.texture = new Texture();
    this.texture.parent = this;
    
    // Once the image is loaded, update width and height if `fitToTexture` is set
    this.texture.on('image-loaded', function() {
      if (self.fitToTexture) {
        self.width = self.texture.image.width;
        self.height = self.texture.image.height;

        self.origin.x = (self.width / 2);
        self.origin.y = (self.height / 2);
      }

      // TODO: Evaluate if the Graphics trigger should only be in the texture
      Graphics.trigger('texture-image-loaded', self, self.texture);
    });

    // Once the label is loaded, update width and height if `fitToTexture` is set
    this.texture.on('label-loaded', function() {
      if (self.fitToTexture) {
        self.width = self.texture.label.width;
        self.height = self.texture.label.height;

        self.origin.x = (self.width / 2);
        self.origin.y = (self.height / 2);

        // TODO: Evaluate if the Graphics trigger should only be in the texture
        Graphics.trigger('texture-label-loaded', self, self.texture);
      }
    });

    this.width = 0;
    this.height = 0;

    this.angle = 0;

    this.alpha = 1;

    this.scale = {
      x: 1,
      y: 1
    };

    this.origin = {
      x: (self.width / 2),
      y: (self.width / 2)
    };

    this.border = {
      width: 0,
      color: 'rgb(0, 0, 0)',
      radius: 0
    };

    // Behaviors
    this.behaviors = new Group();

    // Data models
    this.models = new Group();

    // Mix in renderable and updateable
    renderable.call(this);
    updateable.call(this);

    // Update all behaviors as well
    this.on('update', function() {
      self.behaviors.forEach(function(behavior) {
        behavior.trigger('update');
      });
    });
  };

  GameObject.store = {};

  // Game objects can be defined and are stored on the object itself
  GameObject.define = function(name, factory) {
    GameObject.store[name] = factory;
  };

  GameObject.prototype.addGameObject = function() {
    // Add a game object to this game object
    this.queue.push(addable(GameObject, this.children).apply(this, arguments));
  };

  GameObject.prototype.addBehavior = function() {
    // Add a `Behavior` instance to the the game object and update the `gameObject` property
    this.queue.push(addable(Behavior, this.behaviors, function(child) {
      child.gameObject = this;
    }).apply(this, arguments));
  };

  GameObject.prototype.addModel = function() {
    // Add a `Model` instance to the game object
    this.queue.push(addable(Model, this.models).apply(this, arguments));
  };
  
  GameObject.prototype.removeGameObject = function() {
    
  };
  
  GameObject.prototype.removeBehavior = function() {
    
  };

  GameObject.prototype.toJSON = function() {
    // Serialize this object
    return serialize(this);
  };

  GameObject.prototype.fromJSON = function() {

  };

  GameObject.prototype.animate = function(property, end, time, callback) {
    // TODO: Tweening does not work yet
    if ( typeof this[property] === 'number') {
      var distance = end - this[property];
      var timeInS = (time / 1000);

      var animateName = 'animate-' + Date.now();
      this.on(animateName, function(dt) {

        this.off(animateName);
      });
    }
  };

  return GameObject;
});

udefine('flockn/graphics', ['eventmap'], function(EventMap) {
  'use strict';

  // `Graphics` is an instance of an `EventMap`
  var Graphics = new EventMap();

  // Special property `renderer` can be modified, but not deleted
  Object.defineProperty(Graphics, 'renderer', {
    value: null,
    writable: true,
    enumerable: true
  });

  return Graphics;
});

udefine('flockn/graphics/rootelement', function() {
  'use strict';

  return function(elementName, extraFn) {
    // Sets the container name: If none is given, set the id of the object. 
    // If a `#` is prepended to the string, cut it off
    var containerName = (function() {
      if (this.container == null) {
        this.container = this.id;
        return this.container;
      } else {
        if (this.container.indexOf('#') === 0) {
          return this.container.slice(1);
        }
      }
    }).call(this);

    // Set the dimensions of the object. If none are given, it should be the inside of the browser's window
    this.width = this.width || window.innerWidth;
    this.height = this.height || window.innerHeight;

    // Try to get the HTML element by using `containerName`
    var rootElement = document.getElementById(containerName);

    // If nothing was found, create the element
    if (rootElement == null) {
      var element = document.createElement(elementName);
      element.id = containerName.toLowerCase();
      document.body.appendChild(element);

      rootElement = element;
    }

    rootElement.className = [this.type.toLowerCase(), this.name.toLowerCase()].join(' ');

    // Set the dimensions of the `rootElement`
    rootElement.style.position = 'absolute';
    rootElement.style.width = this.width + 'px';
    rootElement.style.height = this.height + 'px';

    // Allow some extra functionality to happen here.
    // It should be called on the same context and the
    // `rootElement` is passed in as a parameter
    extraFn.call(this, rootElement);

    // Center the element if it's smaller than the inside of the browser's window
    if (this.width < window.innerWidth) {
      rootElement.style.left = '50%';
      rootElement.style.marginLeft = (this.width * (-0.5)) + 'px';
    }

    if (this.height < window.innerHeight) {
      rootElement.style.top = '50%';
      rootElement.style.marginTop = (this.width * (-0.5)) + 'px';
    }

    // Return the element, in case someone wants to meddle with it
    return rootElement;
  };
});

udefine('flockn/group', ['./serialize'], function(serialize) {
  'use strict';

  var unidentified = 'untitled';
  var unidentifiedCounter = 0;

  var Group = function() {
    this.length = 0;

    this.tags = {};
    this.names = {};
    this.types = {};
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
    
    if (obj.type != null) {
    	this.types[obj.type] = this.types[obj.type] || [];
    	this.types[obj.type].push(this.length);
    }

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

  Group.prototype.byType = function(type) {
    return this.types[type].map(function(index) {
      return this[index];
    }, this);
  };

  Group.prototype.byName = function(name) {
    return this[this.names[name]];
  };

  Group.prototype.byTag = function(tag) {
    return this.tags[tag].map(function(index) {
      return this[index];
    }, this);
  };
  
  Group.prototype.select = function(selector) {
  	
  };

  Group.prototype.toJSON = function() {
    return serialize(this);
  };
  
  Group.prototype.remove = function(index) {
    var name = this[index].name;
    var tags = this[index].tags;
    
    delete this.names[name];
    
    
    delete this[index];
    
    /*for (var i = index, i < this.length; i++) {
      this[]
    }*/
    
    this.length--;
  };
  
  Group.prototype.removeByName = function(name) {
    
  };
  
  Group.prototype.removeByTag = function(tags) {
    if (!Array.isArray(tags)) {
      tags = [tags];
    }
    
  };

  return Group;
});

udefine('flockn/model', ['mixedice', 'eventmap'], function(mixedice, EventMap) {
  'use strict';

  var Model = function() {
    // Mix in `EventMap` into all `Model` instances
    mixedice([this, Model.prototype], new EventMap());
    
    // Store attribute data
    this.data = {};
  };

  Model.prototype.get = function(name) {
    // Get an attribute if it exists
    if (Object.hasOwnProperty.call(this.data, name)) {
      return this.data[name];
    }
  };

  Model.prototype.set = function(name, value) {
    // Set or add an attribute
    this.data[name] = value;
    // Trigger the `change` event with `name` and `value` as its parameters
    this.trigger('change', name, value);
  };

  return Model;

});

udefine('flockn/renderable', ['./graphics'], function(Graphics) {
  'use strict';

  return function() {
    var self = this;

    this.on('render', function() {
      // Emit `render` event on the `Graphics` object
      Graphics.trigger('render', self);

      // Render all children elements
      self.children.forEach(function(child) {
        child.trigger('render');
      });
    });
  };
});

udefine('flockn/scene', ['mixedice', './addable', './base', './group', './gameobject', './renderable', './updateable'], function(mixedice, addable, Base, Group, GameObject, renderable, updateable) {
  'use strict';

  // A `Scene` instance is a layer for `GameObject` instances.
  // Any number of game objects can be added to a scene. Only one scene should be visible at the same time, depending
  // on what was set in the `activeScene` property of a `Game` instance.
  var Scene = function(descriptor) {
    Base.extend([this, Scene.prototype], 'Scene', descriptor);

    // Mix in `renderable` and `updateable`
    renderable.call(this);
    updateable.call(this);
  };

  Scene.prototype.addGameObject = function() {
    // Allow game objects to be added to scenes
    this.queue.push(addable(GameObject, this.children).apply(this, arguments));
  };

  Scene.store = {};

  // Scenes can be defined and are stored on the object itself
  Scene.define = function(name, factory) {
    Scene.store[name] = factory;
  };

  return Scene;

});

udefine('flockn/serialize', function() {
  'use strict';

  // Serialize function to `JSON.stringify` with a custom replacer
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

udefine('flockn/texture', ['mixedice', 'eventmap', 'flockn/types/color'], function(mixedice, EventMap, Color) {
  'use strict';

  var Texture = function() {
    // Mix in an `EventMap` instance into the `Texture`
    mixedice([this, Texture.prototype], new EventMap());

    var self = this;

    // Set up dimensions
    this.width = 0;
    this.height = 0;

    // Set parent property
    this.parent = null;

    // The default values for `image`
    this.image = {
      color: Color.transparent,
      drawable: false,
      offset: {
        x: 0,
        y: 0
      },
      data: null,
      width: 0,
      height: 0
    };

    var filename = '';

    Object.defineProperty(this.image, 'filename', {
      get: function() {
        return filename;
      },
      set: function(value) {
        filename = value;

        // TODO: Most of this should already be handled by the preloader
        var img = new Image();
        img.src = filename;

        img.onload = function() {
          self.image.data = img;
          self.image.width = img.width;
          self.image.height = img.height;
          self.image.drawable = true;

          self.trigger('image-loaded');
        };
      },
      enumerable: true
    });

    // Default value for `label`
    this.label = {
      drawable: false,
      font: {
        size: 10,
        name: 'Arial',
        color: Color.black,
        decoration: []
      },
      align: {
        x: 'center',
        y: 'center'
      },
      width: 0,
      height: 0
    };

    var text = '';

    Object.defineProperty(this.label, 'text', {
      get: function() {
        return text;
      },
      set: function(value) {
        text = value;

        // Calculate the size of the label and update the dimensions
        // TODO: This should be handled somewhere else, but I'm not sure where
        var tmpElem = document.createElement('div');
        tmpElem.innerText = text;
        tmpElem.style.position = 'absolute';
        tmpElem.style.left = '-9999px';
        tmpElem.style.top = '-9999px';
        tmpElem.style.fontSize = self.label.font.size + 'px';
        tmpElem.style.fontFamily = self.label.font.name;
        tmpElem.style.color = self.label.font.color;
        
        self.label.font.decoration.forEach(function(decoration) {
          switch (decoration) {
            case 'bold':
              tmpElem.style.fontWeight = 'bold';
              break;
            case 'italic':
              tmpElem.style.fontStyle = 'italic';
              break;
            case 'underline':
              tmpElem.style.textDecoration = 'underline';
              break;
            default:
              break;
          }
        });
        
        document.body.appendChild(tmpElem);
        
        self.label.width = tmpElem.clientWidth;
        self.label.height = tmpElem.clientHeight;
        self.label.drawable = true;
        
        document.body.removeChild(tmpElem);

        self.trigger('label-loaded');
      }
    });

    this.color = Color.white;

  };

  return Texture;
});

define('flockn/types/color', ['clamp', 'flockn/constants/color'], function(clamp, colorConstants) {
  var Color = function(r, g, b, a) {
    this.r = r || 0;
    this.g = g || 0;
    this.b = b || 0;
    this.a = a || 1;
  };
  
  Color.prototype.lighten = function(factor) {
    factor = clamp(factor, 0, 1);
    
    this.r = clamp(this.r + (factor * 255) | 0, 0, 255);
    this.g = clamp(this.g + (factor * 255) | 0, 0, 255);
    this.b = clamp(this.b + (factor * 255) | 0, 0, 255);
  };
  
  Color.prototype.darken = function(factor) {
    factor = clamp(factor, 0, 1);
    
    this.r = clamp(this.r - (factor * 255) | 0, 0, 255);
    this.g = clamp(this.g - (factor * 255) | 0, 0, 255);
    this.b = clamp(this.b - (factor * 255) | 0, 0, 255);
  };
  
  Color.prototype.fadeIn = function(factor) {
    factor = clamp(factor, 0, 1);
    
    this.a = this.a + this.a * factor;
    if (this.a > 1) {
      this.a = 1;
    }
  };
  
  Color.prototype.fadeOut = function(factor) {
    factor = clamp(factor, 0, 1);
    
    this.a = this.a - this.a * factor;
    if (this.a < 0) {
      this.a = 0;
    }
  };
  
  Color.prototype.toString = function() {
    if (this.a < 1) {
      return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
    } else {
      return 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
    }
  };
  
  for (var colorName in colorConstants) {
    var colorValue = colorConstants[colorName];
    Color[colorName] = new Color(colorValue.r, colorValue.g, colorValue.b, colorValue.a);
  }
  
  return Color;
});
define('flockn/types/vector2', function() {
  
  var sqrMagnitude = function(v) {
    return Vector2.dot(v, v);
  };
  
  var Vector2 = function(x, y) {
    this.x = this.x || 0;
    this.y = this.y || 0;
    
    Object.defineProperty(this, 'magnitude', {
      get: function() {
        return Math.sqrt(sqrMagnitude(this));
      }
    });
    
    Object.defineProperty(this, 'sqrMagnitude', {
      get: function() {
        return sqrMagnitude(this);
      }
    });
    
    Object.defineProperty(this, 'angle', {
      get: function() {
        return Math.atan2(this.y, this.x);
      }
    });
  };
  
  Vector2.dot = function(vec1, vec2) {
    return vec1.x * vec2.x + vec1.y * vec2.y;
  };
  
  Vector2.prototype.clone = function() {
    return new Vector2(this.x, this.y);
  };
  
  Vector2.prototype.add = function(vector) {
    this.x += vector.x;
    this.y += vector.y;
  };
  
  Vector2.prototype.subtract = function(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
  };
  
  Vector2.prototype.multiply = function(vector) {
    this.x *= vector.x;
    this.y *= vector.y;
  };
  
  Vector2.prototype.divide = function(vector) {
    this.x /= vector.x;
    this.y /= vector.y;
  };
  
  Vector2.prototype.normalize = function() {
    this.x = this.x / this.magnitude;
    this.y = this.y / this.magnitude;
  };
  
  Vector2.fromAngle = function(angle, magnitude) {
    return new Vector2(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
  };
  
  return Vector2;
  
});

udefine('flockn/updateable', function() {
  'use strict';

  return function() {
    var self = this;

    // Update all children
    this.on('update', function(dt) {
      self.children.forEach(function(child) {
        child.trigger('update', dt);
      });
    });
  };
});

define('flockn/viewport', ['mixedice', 'eventmap'], function(mixedice, EventMap) {
  var Viewport = {};

  Viewport.scale = {};
  Viewport.scale.mode = 'scaleToFit';
  Viewport.scale.x = 1.0;
  Viewport.scale.y = 1.0;

  Viewport.width = 800;
  Viewport.height = 600;

  return Viewport;
}); 
udefine('flockn/world', ['./model'], function(Model) {
  'use strict';

  // `World` is an instance of a model
  var world = new Model();

  return world;
});
