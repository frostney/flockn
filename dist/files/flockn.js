(function(factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/addable', ["exports", "flockn/graphics"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("flockn/graphics"));
  }
})(function(exports, _flocknGraphics) {
  "use strict";
  var _slice = Array.prototype.slice;
  var Graphics = _flocknGraphics.default;

  var addable = function addable(Factory, groupInstance, extraFn) {

    var adder = function adder(child) {
      var args = _slice.call(arguments, 1);

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

  exports.default = addable;
});

(function(factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/assets', ["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  }
})(function(exports) {
  "use strict";
  var Assets = {};

  exports.default = Assets;
});

(function(factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/audio', ["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  }
})(function(exports) {
  "use strict";
  var Audio = {};

  Audio.play = function() {

  };

  exports.default = Audio;
});

(function(factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/base', 
      ["exports", "eventmap", "gameboard/input", "flockn/audio", "flockn/group", "flockn/world"],
      factory
    );
  } else if (typeof exports !== "undefined") {
    factory(
      exports,
      require("eventmap"),
      require("gameboard/input"),
      require("flockn/audio"),
      require("flockn/group"),
      require("flockn/world")
    );
  }
})(function(
  exports,
  _eventmap,
  _gameboardInput,
  _flocknAudio,
  _flocknGroup,
  _flocknWorld) {
  "use strict";

  var _classProps = function(child, staticProps, instanceProps) {
    if (staticProps)
      Object.defineProperties(child, staticProps);

    if (instanceProps)
      Object.defineProperties(child.prototype, instanceProps);
  };

  var _extends = function(child, parent) {
    child.prototype = Object.create(parent.prototype, {
      constructor: {
        value: child,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });

    child.__proto__ = parent;
  };

  var EventMap = _eventmap;
  var Input = _gameboardInput;
  var Audio = _flocknAudio.default;
  var Group = _flocknGroup.default;
  var World = _flocknWorld.default;

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

  var Base = function(EventMap) {
    var Base = function Base(type, descriptor) {
      if (type === undefined)
        type = 'Base';

      EventMap.call(this);

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

    _extends(Base, EventMap);

    _classProps(Base, {
      queueOrder: {
        get: function() {
          // TODO: Move this to a closure?
          return ['Game', 'Scene', 'GameObject', 'Behavior', 'Model'];
        }
      }
    }, {
      apply: {
        writable: true,

        value: function(args) {
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
        }
      },

      call: {
        writable: true,

        value: function() {
          // Call `Base#apply` with the arguments object
          this.apply(arguments);
        }
      },

      reset: {
        writable: true,

        value: function() {
          return this.call.apply(this, arguments);
        }
      },

      closest: {
        writable: true,

        value: function() {

        }
      },

      find: {
        writable: true,

        value: function() {

        }
      },

      log: {
        writable: true,

        value: function() {
          if (console && console.log) {
            var argArray = [].slice.call(arguments);

            // Log with `console.log`: Prepend the type and name
            argArray.unshift(':');
            argArray.unshift(this.name);
            argArray.unshift(this.type);

            return console.log.apply(console, argArray);
          }
        }
      }
    });

    return Base;
  }(EventMap);

  exports.default = Base;
});

(function(factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/behavior', 
      ["exports", "flockn/addable", "flockn/base", "flockn/group", "flockn/updateable"],
      factory
    );
  } else if (typeof exports !== "undefined") {
    factory(
      exports,
      require("flockn/addable"),
      require("flockn/base"),
      require("flockn/group"),
      require("flockn/updateable")
    );
  }
})(
  function(exports, _flocknAddable, _flocknBase, _flocknGroup, _flocknUpdateable) {
    "use strict";

    var _classProps = function(child, staticProps, instanceProps) {
      if (staticProps)
        Object.defineProperties(child, staticProps);

      if (instanceProps)
        Object.defineProperties(child.prototype, instanceProps);
    };

    var _extends = function(child, parent) {
      child.prototype = Object.create(parent.prototype, {
        constructor: {
          value: child,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });

      child.__proto__ = parent;
    };

    var addable = _flocknAddable.default;
    var Base = _flocknBase.default;
    var Group = _flocknGroup.default;
    var updateable = _flocknUpdateable.default;

    var Behavior = function(Base) {
      var Behavior = function Behavior(descriptor) {
        Base.call(this, 'Behavior', descriptor);

        // Reference to the game object itself
        this.gameObject = null;

        // Mix in `updateable`
        updateable.call(this);
      };

      _extends(Behavior, Base);

      _classProps(Behavior, {
        define: {
          writable: true,

          value: function(name, factory) {
            Behavior.store[name] = factory;
          }
        }
      }, {
        addBehavior: {
          writable: true,

          value: function() {
            // When a behavior is added, the reference to the game object is set
            this.queue.push(addable(Behavior, this.children, function(child) {
              child.gameObject = this.gameObject;
            }).apply(this, arguments));
          }
        },

        removeBehavior: {
          writable: true,

          value: function() {

          }
        }
      });

      return Behavior;
    }(Base);

    // Behaviors can be defined and are stored on the object itself
    Behavior.store = {};

    exports.default = Behavior;
  }
);

(function(factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/constants/color', ["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  }
})(function(exports) {
  "use strict";
  var colors = {
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
  };

  exports.default = colors;
});

(function(factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/game', 
      ["exports", "gameboard/loop", "flockn/addable", "flockn/base", "flockn/graphics", "flockn/scene", "flockn/renderable", "flockn/types/color", "flockn/updateable", "flockn/viewport"],
      factory
    );
  } else if (typeof exports !== "undefined") {
    factory(
      exports,
      require("gameboard/loop"),
      require("flockn/addable"),
      require("flockn/base"),
      require("flockn/graphics"),
      require("flockn/scene"),
      require("flockn/renderable"),
      require("flockn/types/color"),
      require("flockn/updateable"),
      require("flockn/viewport")
    );
  }
})(function(
  exports,
  _gameboardLoop,
  _flocknAddable,
  _flocknBase,
  _flocknGraphics,
  _flocknScene,
  _flocknRenderable,
  _flocknTypesColor,
  _flocknUpdateable,
  _flocknViewport) {
  "use strict";

  var _classProps = function(child, staticProps, instanceProps) {
    if (staticProps)
      Object.defineProperties(child, staticProps);

    if (instanceProps)
      Object.defineProperties(child.prototype, instanceProps);
  };

  var _extends = function(child, parent) {
    child.prototype = Object.create(parent.prototype, {
      constructor: {
        value: child,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });

    child.__proto__ = parent;
  };

  var Loop = _gameboardLoop;
  var addable = _flocknAddable.default;
  var Base = _flocknBase.default;
  var Graphics = _flocknGraphics.default;
  var Scene = _flocknScene.default;
  var renderable = _flocknRenderable.default;
  var Color = _flocknTypesColor.default;
  var updateable = _flocknUpdateable.default;
  var Viewport = _flocknViewport.default;

  var root = window;

  var Game = function(Base) {
    var Game = function Game(descriptor) {
      var _this = this;
      // The new operator does not need to be set explicitly.
      // If it isn't we return an instance of `Game`
      if (!this || !this instanceof Game) {
        return new Game(descriptor);
      }

      // Extend the `Base` class
      Base.call(this, 'Game', descriptor);

      descriptor.call(this);

      Graphics.trigger('initialize', this);

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
        _this.trigger('update', dt / 1000);
      });

      // Bind the game loop to the `render` event
      Loop.on('render', function() {
        _this.trigger('render');
      });

      // Add a `resize` event to each `Game` instance
      root.addEventListener('resize', function() {
        var newWidth = root.innerWidth;
        var newHeight = root.innerHeight;

        _this.trigger('resize', newWidth, newHeight);

        // Trigger resize event for the current scene
        _this.activeScene.trigger('resize', newWidth, newHeight);
      }, false);

      // Add an `orientationchange` event to each `Game` instance
      root.addEventListener('orientationchange', function() {
        _this.trigger('orientationchange');
      }, false);
    };

    _extends(Game, Base);

    _classProps(Game, null, {
      addScene: {
        writable: true,

        value: function() {
          // When adding a scene, the dimension of scenes should be
          // exactly as large as the `Game` instance itself
          this.queue.push(addable(Scene, this.children, function (child) {
            child.width = this.width;
            child.height = this.height;
          }).apply(this, arguments));
        }
      },

      showScene: {
        writable: true,

        value: function(name) {
          // TODO: Add transitions

          // Set the `activeScene` property
          this.activeScene = name;

          // Call resize event
          this.children[this.activeScene].trigger('resize', root.innerWidth, root.innerHeight);

          // Trigger the `show` event
          this.trigger('show', this.activeScene, this.children[this.activeScene]);
        }
      },

      preload: {
        writable: true,

        value: function(assets) {

        }
      },

      run: {
        writable: true,

        value: function(name) {
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
        }
      }
    });

    return Game;
  }(Base);

  exports.default = Game;
});

(function(factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/gameobject', 
      ["exports", "flockn/addable", "flockn/base", "flockn/behavior", "flockn/graphics", "flockn/group", "flockn/model", "flockn/renderable", "flockn/serialize", "flockn/texture", "flockn/updateable"],
      factory
    );
  } else if (typeof exports !== "undefined") {
    factory(
      exports,
      require("flockn/addable"),
      require("flockn/base"),
      require("flockn/behavior"),
      require("flockn/graphics"),
      require("flockn/group"),
      require("flockn/model"),
      require("flockn/renderable"),
      require("flockn/serialize"),
      require("flockn/texture"),
      require("flockn/updateable")
    );
  }
})(function(
  exports,
  _flocknAddable,
  _flocknBase,
  _flocknBehavior,
  _flocknGraphics,
  _flocknGroup,
  _flocknModel,
  _flocknRenderable,
  _flocknSerialize,
  _flocknTexture,
  _flocknUpdateable) {
  "use strict";

  var _classProps = function(child, staticProps, instanceProps) {
    if (staticProps)
      Object.defineProperties(child, staticProps);

    if (instanceProps)
      Object.defineProperties(child.prototype, instanceProps);
  };

  var _extends = function(child, parent) {
    child.prototype = Object.create(parent.prototype, {
      constructor: {
        value: child,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });

    child.__proto__ = parent;
  };

  var addable = _flocknAddable.default;
  var Base = _flocknBase.default;
  var Behavior = _flocknBehavior.default;
  var Graphics = _flocknGraphics.default;
  var Group = _flocknGroup.default;
  var Model = _flocknModel.default;
  var renderable = _flocknRenderable.default;
  var serialize = _flocknSerialize.default;
  var Texture = _flocknTexture.default;
  var updateable = _flocknUpdateable.default;

  var GameObject = function(Base) {
    var GameObject = function GameObject(descriptor) {
      var _this = this;
      Base.call(this, 'GameObject', descriptor);

      this.visible = true;

      this.x = 0;
      this.y = 0;
      this.z = 0;

      this.fitToTexture = true;

      // Create a new texture and bind it to the `texture` property
      this.texture = new Texture();
      this.texture.parent = this;

      // Once the image is loaded, update width and height if `fitToTexture` is set
      this.texture.on('image-loaded', function() {
        if (_this.fitToTexture) {
          _this.width = _this.texture.image.width;
          _this.height = _this.texture.image.height;

          _this.origin.x = (_this.width / 2);
          _this.origin.y = (_this.height / 2);
        }

        // TODO: Evaluate if the Graphics trigger should only be in the texture
        Graphics.trigger('texture-image-loaded', _this, _this.texture);
      });

      // Once the label is loaded, update width and height if `fitToTexture` is set
      this.texture.on('label-loaded', function() {
        if (_this.fitToTexture) {
          _this.width = _this.texture.label.width;
          _this.height = _this.texture.label.height;

          _this.origin.x = (_this.width / 2);
          _this.origin.y = (_this.height / 2);

          // TODO: Evaluate if the Graphics trigger should only be in the texture
          Graphics.trigger('texture-label-loaded', _this, _this.texture);
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
        x: (this.width / 2),
        y: (this.width / 2)
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
        _this.behaviors.forEach(function(behavior) {
          behavior.trigger('update');
        });
      });
    };

    _extends(GameObject, Base);

    _classProps(GameObject, {
      define: {
        writable: true,

        value: function(name, factory) {
          GameObject.store[name] = factory;
        }
      },

      fromJSON: {
        writable: true,

        value: function() {

        }
      }
    }, {
      left: {
        get: function() {
          return this.x;
        },

        set: function(value) {
          this.x = value;
        }
      },

      top: {
        get: function() {
          return this.y;
        },

        set: function(value) {
          this.y = value;
        }
      },

      right: {
        get: function() {
          return this.parent.width - this.width - this.x;
        },

        set: function(value) {
          this.x = this.parent.width - this.width - value;
        }
      },

      bottom: {
        get: function() {
          return this.parent.height - this.height - this.y;
        },

        set: function(value) {
          this.y = this.parent.height - this.height - value;
        }
      },

      addGameObject: {
        writable: true,

        value: function() {
          // Add a game object to this game object
          this.queue.push(addable(GameObject, this.children).apply(this, arguments));
        }
      },

      addBehavior: {
        writable: true,

        value: function() {
          // Add a `Behavior` instance to the the game object and update the `gameObject` property
          this.queue.push(addable(Behavior, this.behaviors, function(child) {
            child.gameObject = this;
          }).apply(this, arguments));
        }
      },

      addModel: {
        writable: true,

        value: function() {
          // Add a `Model` instance to the game object
          this.queue.push(addable(Model, this.models).apply(this, arguments));
        }
      },

      removeGameObject: {
        writable: true,

        value: function() {

        }
      },

      removeBehavior: {
        writable: true,

        value: function() {

        }
      },

      removeModel: {
        writable: true,

        value: function() {

        }
      },

      toJSON: {
        writable: true,

        value: function() {
          // Serialize this object
          return serialize(this);
        }
      },

      animate: {
        writable: true,

        value: function(property, end, time, callback) {
          // TODO: Tweening does not work yet
          if ( typeof this[property] === 'number') {
            var distance = end - this[property];
            var timeInS = (time / 1000);

            var animateName = 'animate-' + Date.now();
            this.on(animateName, function(dt) {

              this.off(animateName);
            });
          }
        }
      }
    });

    return GameObject;
  }(Base);

  GameObject.store = {};

  exports.default = GameObject;
});

(function(factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/graphics', ["exports", "eventmap"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("eventmap"));
  }
})(function(exports, _eventmap) {
  "use strict";
  var EventMap = _eventmap;

  // `Graphics` is an instance of an `EventMap`
  var _Graphics = new EventMap();

  // Special property `renderer` can be modified, but not deleted
  Object.defineProperty(_Graphics, 'renderer', {
    value: null,
    writable: true,
    enumerable: true
  });

  exports.default = _Graphics;
});

(function(factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/graphics/rootelement', ["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  }
})(function(exports) {
  "use strict";
  var createRootElement = function createRootElement(elementName, extraFn) {
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

  exports.default = createRootElement;
});

(function(factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/group', ["exports", "flockn/serialize"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("flockn/serialize"));
  }
})(function(exports, _flocknSerialize) {
  "use strict";

  var _classProps = function(child, staticProps, instanceProps) {
    if (staticProps)
      Object.defineProperties(child, staticProps);

    if (instanceProps)
      Object.defineProperties(child.prototype, instanceProps);
  };

  var serialize = _flocknSerialize.default;

  var unidentified = 'untitled';
  var unidentifiedCounter = 0;

  var Group = function() {
    var Group = function Group() {
      this.length = 0;

      this.tags = {};
      this.names = {};
      this.types = {};
    };

    _classProps(Group, null, {
      push: {
        writable: true,

        value: function(obj, tags) {
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
        }
      },

      pop: {
        writable: true,

        value: function() {
          return this[this.length];
        }
      },

      splice: {
        writable: true,

        value: function(index, how) {

        }
      },

      slice: {
        writable: true,

        value: function(begin, end) {
          if (end == null) {
            end = this.length;
          }

          var slicedGroup = new Group();

          for (var i = begin; i < end; i++) {
            slicedGroup.push(this[i]);
          }

          return slicedGroup;
        }
      },

      forEach: {
        writable: true,

        value: function(callback) {
          for (var i = 0; i < this.length; i++) {
            callback(this[i]);
          }
        }
      },

      map: {
        writable: true,

        value: function(callback) {
          var mappedArray = new Group();

          for (var i = 0; i < this.length; i++) {
            mappedArray.push(callback(this[i]));
          }

          return mappedArray;
        }
      },

      filter: {
        writable: true,

        value: function(callback) {
          var filteredArray = new Group();

          for (var i = 0; i < this.length; i++) {
            if (callback(this[i])) {
              filteredArray.push(this[i]);
            }
          }

          return filteredArray;
        }
      },

      byType: {
        writable: true,

        value: function(type) {
          return this.types[type].map(function(index) {
            return this[index];
          }, this);
        }
      },

      byName: {
        writable: true,

        value: function(name) {
          return this[this.names[name]];
        }
      },

      byTag: {
        writable: true,

        value: function(tag) {
          return this.tags[tag].map(function(index) {
            return this[index];
          }, this);
        }
      },

      select: {
        writable: true,

        value: function(selector) {

        }
      },

      toJSON: {
        writable: true,

        value: function() {
          return serialize(this);
        }
      },

      toString: {
        writable: true,

        value: function() {
          return JSON.stringify(this.toJSON());
        }
      },

      remove: {
        writable: true,

        value: function(index) {
          var name = this[index].name;
          var tags = this[index].tags;

          delete this.names[name];


          delete this[index];

          /*for (var i = index, i < this.length; i++) {
           this[]
           }*/

          this.length--;
        }
      },

      removeByName: {
        writable: true,

        value: function(name) {

        }
      },

      removeByTag: {
        writable: true,

        value: function(tag) {
          if (!Array.isArray(tags)) {
            tags = [tags];
          }
        }
      }
    });

    return Group;
  }();

  exports.default = Group;
});

(function(factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/model', ["exports", "mixedice", "eventmap"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("mixedice"), require("eventmap"));
  }
})(function(exports, _mixedice, _eventmap) {
  "use strict";

  var _classProps = function(child, staticProps, instanceProps) {
    if (staticProps)
      Object.defineProperties(child, staticProps);

    if (instanceProps)
      Object.defineProperties(child.prototype, instanceProps);
  };

  var _extends = function(child, parent) {
    child.prototype = Object.create(parent.prototype, {
      constructor: {
        value: child,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });

    child.__proto__ = parent;
  };

  var mixedice = _mixedice;
  var EventMap = _eventmap;

  var Model = function(EventMap) {
    var Model = function Model() {
      EventMap.call(this);

      // Store attribute data
      this.data = {};
    };

    _extends(Model, EventMap);

    _classProps(Model, null, {
      get: {
        writable: true,

        value: function() {
          // Get an attribute if it exists
          if (Object.hasOwnProperty.call(this.data, name)) {
            return this.data[name];
          }
        }
      },

      set: {
        writable: true,

        value: function(name, value) {
          // Set or add an attribute
          this.data[name] = value;
          // Trigger the `change` event with `name` and `value` as its parameters
          this.trigger('change', name, value);
        }
      }
    });

    return Model;
  }(EventMap);

  exports.default = Model;
});

(function(factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/renderable', ["exports", "flockn/graphics"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("flockn/graphics"));
  }
})(function(exports, _flocknGraphics) {
  "use strict";
  var Graphics = _flocknGraphics.default;

  var renderable = function renderable() {
    var _this = this;
    this.on('render', function() {
      // Emit `render` event on the `Graphics` object
      Graphics.trigger('render', _this);

      // Render all children elements
      _this.children.forEach(function(child) {
        child.trigger('render');
      });
    });
  };

  exports.default = renderable;
});

(function(factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/scene', 
      ["exports", "flockn/addable", "flockn/base", "flockn/gameobject", "flockn/renderable", "flockn/updateable"],
      factory
    );
  } else if (typeof exports !== "undefined") {
    factory(
      exports,
      require("flockn/addable"),
      require("flockn/base"),
      require("flockn/gameobject"),
      require("flockn/renderable"),
      require("flockn/updateable")
    );
  }
})(function(
  exports,
  _flocknAddable,
  _flocknBase,
  _flocknGameobject,
  _flocknRenderable,
  _flocknUpdateable) {
  "use strict";

  var _classProps = function(child, staticProps, instanceProps) {
    if (staticProps)
      Object.defineProperties(child, staticProps);

    if (instanceProps)
      Object.defineProperties(child.prototype, instanceProps);
  };

  var _extends = function(child, parent) {
    child.prototype = Object.create(parent.prototype, {
      constructor: {
        value: child,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });

    child.__proto__ = parent;
  };

  var addable = _flocknAddable.default;
  var Base = _flocknBase.default;
  var GameObject = _flocknGameobject.default;
  var renderable = _flocknRenderable.default;
  var updateable = _flocknUpdateable.default;

  var Scene = function(Base) {
    var Scene = function Scene(descriptor) {
      Base.call(this, 'Scene', descriptor);

      // Mix in `renderable` and `updateable`
      renderable.call(this);
      updateable.call(this);
    };

    _extends(Scene, Base);

    _classProps(Scene, {
      define: {
        writable: true,

        value: function(name, factory) {
          Scene.store[name] = factory;
        }
      }
    }, {
      addGameObject: {
        writable: true,

        value: function() {
          // Allow game objects to be added to scenes
          this.queue.push(addable(GameObject, this.children).apply(this, arguments));
        }
      }
    });

    return Scene;
  }(Base);

  exports.default = Scene;
});

// Serialize function to `JSON.stringify` with a custom replacer
(function(factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/serialize', ["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  }
})(function(exports) {
  "use strict";
  var serialize = function serialize(obj) {
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

  exports.default = serialize;
});

(function(factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/texture', ["exports", "flockn/types", "mixedice", "eventmap"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("flockn/types"), require("mixedice"), require("eventmap"));
  }
})(function(exports, _flocknTypes, _mixedice, _eventmap) {
  "use strict";

  var _extends = function(child, parent) {
    child.prototype = Object.create(parent.prototype, {
      constructor: {
        value: child,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });

    child.__proto__ = parent;
  };

  var Color = _flocknTypes.Color;
  var mixedice = _mixedice;
  var EventMap = _eventmap;

  var Texture = function(EventMap) {
    var Texture = function Texture() {
      EventMap.call(this);

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
        get: function () {
          return filename;
        },
        set: function (value) {
          filename = value;

          // TODO: Most of this should already be handled by the preloader
          var img = new Image();
          img.src = filename;

          img.onload = function () {
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
        get: function () {
          return text;
        },
        set: function (value) {
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

          self.label.font.decoration.forEach(function (decoration) {
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

    _extends(Texture, EventMap);
    return Texture;
  }(EventMap);

  exports.default = Texture;
});

(function(factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/types/color', ["exports", "clamp", "flockn/constants/color"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("clamp"), require("flockn/constants/color"));
  }
})(function(exports, _clamp, _flocknConstantsColor) {
  "use strict";

  var _classProps = function(child, staticProps, instanceProps) {
    if (staticProps)
      Object.defineProperties(child, staticProps);

    if (instanceProps)
      Object.defineProperties(child.prototype, instanceProps);
  };

  var clamp = _clamp;
  var colorConstants = _flocknConstantsColor.default;

  var Color = function() {
    var Color = function Color(r, g, b, a) {
      if (a === undefined)
        a = 1;

      if (b === undefined)
        b = 0;

      if (g === undefined)
        g = 0;

      if (r === undefined)
        r = 0;

      this.r = r;
      this.g = g;
      this.b = b;
      this.a = a;
    };

    _classProps(Color, null, {
      lighten: {
        writable: true,

        value: function(factor) {
          factor = clamp(factor, 0, 1);

          this.r = clamp(this.r + (factor * 255) | 0, 0, 255);
          this.g = clamp(this.g + (factor * 255) | 0, 0, 255);
          this.b = clamp(this.b + (factor * 255) | 0, 0, 255);
        }
      },

      darken: {
        writable: true,

        value: function(factor) {
          factor = clamp(factor, 0, 1);

          this.r = clamp(this.r - (factor * 255) | 0, 0, 255);
          this.g = clamp(this.g - (factor * 255) | 0, 0, 255);
          this.b = clamp(this.b - (factor * 255) | 0, 0, 255);
        }
      },

      fadeIn: {
        writable: true,

        value: function(factor) {
          factor = clamp(factor, 0, 1);

          this.a = this.a + this.a * factor;
          if (this.a > 1) {
            this.a = 1;
          }
        }
      },

      fadeOut: {
        writable: true,

        value: function(factor) {
          factor = clamp(factor, 0, 1);

          this.a = this.a - this.a * factor;
          if (this.a < 0) {
            this.a = 0;
          }
        }
      },

      toString: {
        writable: true,

        value: function() {
          if (this.a < 1) {
            return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
          } else {
            return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
          }
        }
      }
    });

    return Color;
  }();

  for (var colorName in colorConstants) {
    var colorValue = colorConstants[colorName];
    Color[colorName] = new Color(colorValue.r, colorValue.g, colorValue.b, colorValue.a);
  }

  exports.default = Color;
});

(function(factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/types', ["exports", "flockn/types/color", "flockn/types/vector2"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("flockn/types/color"), require("flockn/types/vector2"));
  }
})(function(exports, _flocknTypesColor, _flocknTypesVector2) {
  "use strict";
  var Color = _flocknTypesColor.default;
  var Vector2 = _flocknTypesVector2.default;

  var _Types = {};

  _Types.Color = Color;
  _Types.Vector2 = Vector2;

  exports.default = _Types;
  exports.Color = Color;
  exports.Vector2 = Vector2;
});

(function(factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/types/vector2', ["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  }
})(function(exports) {
  "use strict";

  var _classProps = function(child, staticProps, instanceProps) {
    if (staticProps)
      Object.defineProperties(child, staticProps);

    if (instanceProps)
      Object.defineProperties(child.prototype, instanceProps);
  };

  var _sqrMagnitude = function(v) {
    return Vector2.dot(v, v);
  };

  var Vector2 = function() {
    var Vector2 = function Vector2(x, y) {
      if (y === undefined)
        y = 0;

      if (x === undefined)
        x = 0;

      this.x = x;
      this.y = y;
    };

    _classProps(Vector2, {
      dot: {
        writable: true,

        value: function(vec1, vec2) {
          return vec1.x * vec2.x + vec1.y * vec2.y;
        }
      },

      fromAngle: {
        writable: true,

        value: function(angle, magnitude) {
          return new Vector2(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
        }
      }
    }, {
      magnitude: {
        get: function() {
          return Math.sqrt(_sqrMagnitude(this));
        }
      },

      sqrMagnitude: {
        get: function() {
          return _sqrMagnitude(this);
        }
      },

      angle: {
        get: function() {
          return Math.atan2(this.x, this.y);
        }
      },

      clone: {
        writable: true,

        value: function() {
          return new Vector2(this.x, this.y);
        }
      },

      add: {
        writable: true,

        value: function(vector) {
          this.x += vector.x;
          this.y += vector.y;
        }
      },

      subtract: {
        writable: true,

        value: function(vector) {
          this.x -= vector.x;
          this.y -= vector.y;
        }
      },

      multiply: {
        writable: true,

        value: function(vector) {
          this.x *= vector.x;
          this.y *= vector.y;
        }
      },

      divide: {
        writable: true,

        value: function(vector) {
          this.x /= vector.x;
          this.y /= vector.y;
        }
      },

      normalize: {
        writable: true,

        value: function() {
          this.x = this.x / this.magnitude;
          this.y = this.y / this.magnitude;
        }
      }
    });

    return Vector2;
  }();

  exports.default = Vector2;
});

(function(factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/updateable', ["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  }
})(function(exports) {
  "use strict";
  var updatable = function() {
    var self = this;

    // Update all children
    this.on('update', function(dt) {
      self.children.forEach(function(child) {
        child.trigger('update', dt);
      });
    });
  };

  exports.default = updatable;
});

(function(factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/viewport', ["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  }
})(function(exports) {
  "use strict";
  var Viewport = {};

  Viewport.scale = {};
  Viewport.scale.mode = 'scaleToFit';
  Viewport.scale.x = 1;
  Viewport.scale.y = 1;

  Viewport.width = 800;
  Viewport.height = 600;

  exports.default = Viewport;
});

(function(factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/world', ["exports", "flockn/model"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("flockn/model"));
  }
})(function(exports, _flocknModel) {
  "use strict";
  var Model = _flocknModel.default;

  // `World` is an instance of a model
  var world = new Model();

  exports.default = world;
});
