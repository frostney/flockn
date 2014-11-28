(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/assets', ["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  }
})(function (exports) {
  "use strict";

  var Assets = {};

  exports.default = Assets;
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/audio', ["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  }
})(function (exports) {
  "use strict";

  var Audio = {};

  Audio.play = function () {};

  exports.default = Audio;
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/base', ["exports", "eventmap", "gameboard", "flockn/audio", "flockn/group", "flockn/world"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("eventmap"), require("gameboard"), require("flockn/audio"), require("flockn/group"), require("flockn/world"));
  }
})(function (exports, _eventmap, _gameboard, _flocknAudio, _flocknGroup, _flocknWorld) {
  "use strict";

  var _classProps = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var _extends = function (child, parent) {
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

  var EventMap = _eventmap.default;
  var Input = _gameboard.Input;
  var Audio = _flocknAudio.default;
  var Group = _flocknGroup.default;
  var World = _flocknWorld.default;


  var objectIndex = 0;

  var prependMax = 10000;

  var numToIdString = function (num) {
    var stringNum = num + "";

    if (num >= prependMax) {
      return stringNum;
    } else {
      var prependLength = (prependMax + "").length - stringNum.length;
      for (var i = 0; i < prependLength; i++) {
        stringNum = "0" + stringNum;
      }

      return stringNum;
    }
  };

  var Base = (function (EventMap) {
    var Base = function Base(type, descriptor) {
      if (descriptor === undefined) descriptor = function () {};
      if (type === undefined) type = "Base";
      EventMap.call(this);

      // Count up `objectIndex` and stringify it
      var currentObject = numToIdString(++objectIndex);

      this.type = type;

      var internalId = "" + this.type + "-" + Date.now() + "-" + currentObject;

      this.name = internalId;

      // The `id` property is read-only and returns the type and the stringified object index
      Object.defineProperty(this, "id", {
        get: function () {
          return internalId;
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
      this.trigger("constructed");
    };

    _extends(Base, EventMap);

    _classProps(Base, null, {
      apply: {
        writable: true,
        value: function (args) {
          // TODO: Reflect if function check should be enforced here
          if (this.descriptor) {
            // If args is not an array or array-like, provide an empty one
            args = args || [];

            // Call the `descriptor` property with `args`
            this.descriptor.apply(this, args);

            // Trigger an event
            this.trigger("execute");

            // TODO: Impose an order in the queue, such as:
            // (Game) -> Scene -> GameObject -> Behavior -> Model

            // TODO: Implement z-order
            this.queue.forEach(function (q) {
              q && q();
            });

            // Reset the queue
            this.queue = [];

            // Find a way to directly before and after events
            this.trigger("executed");
          }
        }
      },
      call: {
        writable: true,
        value: function () {
          // Call `Base#apply` with the arguments object
          this.apply(arguments);
        }
      },
      reset: {
        writable: true,
        value: function () {
          return this.call.apply(this, arguments);
        }
      },
      closest: {
        writable: true,
        value: function () {}
      },
      find: {
        writable: true,
        value: function () {}
      },
      log: {
        writable: true,
        value: function () {
          if (console && console.log) {
            var argArray = [].slice.call(arguments);

            // Log with `console.log`: Prepend the type and name
            argArray.unshift(":");
            argArray.unshift(this.name);
            argArray.unshift(this.type);

            return console.log.apply(console, argArray);
          }
        }
      }
    });

    return Base;
  })(EventMap);

  Base.queueOrder = ["Game", "Scene", "GameObject", "Behavior", "Model"];

  exports.default = Base;
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/behavior', ["exports", "flockn/base", "flockn/group", "flockn/mixins"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("flockn/base"), require("flockn/group"), require("flockn/mixins"));
  }
})(function (exports, _flocknBase, _flocknGroup, _flocknMixins) {
  "use strict";

  var _classProps = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var _extends = function (child, parent) {
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

  var Base = _flocknBase.default;
  var Group = _flocknGroup.default;
  var addable = _flocknMixins.addable;
  var updateable = _flocknMixins.updateable;
  var Behavior = (function (Base) {
    var Behavior = function Behavior(descriptor) {
      Base.call(this, "Behavior", descriptor);

      // Reference to the game object itself
      this.gameObject = null;

      // Mix in `updateable`
      updateable.call(this);
    };

    _extends(Behavior, Base);

    _classProps(Behavior, {
      define: {
        writable: true,
        value: function (name, factory) {
          Behavior.store[name] = factory;
        }
      }
    }, {
      addBehavior: {
        writable: true,
        value: function () {
          // When a behavior is added, the reference to the game object is set
          this.queue.push(addable(Behavior, this.children, function (child) {
            child.gameObject = this.gameObject;
          }).apply(this, arguments));
        }
      },
      removeBehavior: {
        writable: true,
        value: function () {}
      }
    });

    return Behavior;
  })(Base);

  // Behaviors can be defined and are stored on the object itself
  Behavior.store = {};

  exports.default = Behavior;
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/constants/color', ["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  }
})(function (exports) {
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
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/game', ["exports", "gameboard/loop", "flockn/base", "flockn/graphics", "flockn/scene", "flockn/types/color", "flockn/viewport", "flockn/mixins"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("gameboard/loop"), require("flockn/base"), require("flockn/graphics"), require("flockn/scene"), require("flockn/types/color"), require("flockn/viewport"), require("flockn/mixins"));
  }
})(function (exports, _gameboardLoop, _flocknBase, _flocknGraphics, _flocknScene, _flocknTypesColor, _flocknViewport, _flocknMixins) {
  "use strict";

  var _classProps = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var _extends = function (child, parent) {
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
  var Base = _flocknBase.default;
  var Graphics = _flocknGraphics.default;
  var Scene = _flocknScene.default;
  var Color = _flocknTypesColor.default;
  var Viewport = _flocknViewport.default;
  var addable = _flocknMixins.addable;
  var renderable = _flocknMixins.renderable;
  var updateable = _flocknMixins.updateable;


  var root = window;

  var Game = (function (Base) {
    var Game = function Game(descriptor) {
      var _this = this;
      // The new operator does not need to be set explicitly.
      // If it isn't we return an instance of `Game`
      if (!this || !this instanceof Game) {
        return new Game(descriptor);
      }

      // Extend the `Base` class
      Base.call(this, "Game", descriptor);

      // `this.container` is a string, which is the id of the element.
      // If it's not given, it should create a new element. This should be handled by the renderer.
      this.container = null;

      // By default, the width and height of a `Game` instance will be as large as the inside of the browser window.
      this.width = root.innerWidth;
      this.height = root.innerHeight;
      this.color = new Color(255, 255, 255);

      // Set the viewport object
      this.viewport = Viewport;

      // `this.activeScene` is set to `null` by default, but will change to the instance of the scene
      // once a scene will be shown
      this.activeScene = null;

      // A `Game` instance is the root element so the descriptor needs to be called directly,
      // because it won't be added to anywhere else
      this.call();

      Graphics.trigger("initialize", this);

      // Mix in `renderable` and `updateable`
      renderable.call(this);
      updateable.call(this);

      // Bind the game loop to the `update` event
      Loop.on("update", function (dt) {
        // Deltatime should not be a millisecond value, but a second one.
        // It should be a value between 0 - 1
        _this.trigger("update", dt / 1000);
      });

      // Bind the game loop to the `render` event
      Loop.on("render", function () {
        _this.trigger("render");
      });

      // Add a `resize` event to each `Game` instance
      root.addEventListener("resize", function () {
        var newWidth = root.innerWidth;
        var newHeight = root.innerHeight;

        _this.trigger("resize", newWidth, newHeight);

        // Trigger resize event for the current scene
        var currentScene = _this.children.byName(_this.activeScene);

        if (currentScene) {
          currentScene.trigger("resize", root.innerWidth, root.innerHeight);
        }
      }, false);

      // Add an `orientationchange` event to each `Game` instance
      root.addEventListener("orientationchange", function () {
        _this.trigger("orientationchange");
      }, false);
    };

    _extends(Game, Base);

    _classProps(Game, null, {
      addScene: {
        writable: true,
        value: function () {
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
        value: function (name) {
          // TODO: Add transitions
          this.children.forEach(function (scene) {
            return scene.visible = false;
          });

          // Set the `activeScene` property
          this.activeScene = this.children.byName(name);
          this.activeScene.visible = true;

          if (this.activeScene) {
            this.activeScene.trigger("resize", root.innerWidth, root.innerHeight);

            // Trigger the `show` event
            this.trigger("show", name, this.children[this.activeScene]);
          }
        }
      },
      preload: {
        writable: true,
        value: function (assets) {}
      },
      run: {
        writable: true,
        value: function (name) {
          var _this2 = this;
          this.on("executed", function () {
            // Start the game loop
            Loop.run();

            if (!name) {
              // If there's only no name, take the first scene
              if (_this2.children.length >= 1) {
                name = _this2.children.first().name;
              }
            }

            // Show the scene if a parameter has been specified
            _this2.showScene(name);
          });
        }
      }
    });

    return Game;
  })(Base);

  exports.default = Game;
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/gameobject', ["exports", "flockn/base", "flockn/behavior", "flockn/graphics", "flockn/group", "flockn/model", "flockn/serialize", "flockn/texture", "flockn/types", "flockn/mixins"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("flockn/base"), require("flockn/behavior"), require("flockn/graphics"), require("flockn/group"), require("flockn/model"), require("flockn/serialize"), require("flockn/texture"), require("flockn/types"), require("flockn/mixins"));
  }
})(function (exports, _flocknBase, _flocknBehavior, _flocknGraphics, _flocknGroup, _flocknModel, _flocknSerialize, _flocknTexture, _flocknTypes, _flocknMixins) {
  "use strict";

  var _classProps = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var _extends = function (child, parent) {
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

  var Base = _flocknBase.default;
  var Behavior = _flocknBehavior.default;
  var Graphics = _flocknGraphics.default;
  var Group = _flocknGroup.default;
  var Model = _flocknModel.default;
  var serialize = _flocknSerialize.default;
  var Texture = _flocknTexture.default;
  var Vector2 = _flocknTypes.Vector2;
  var Vector3 = _flocknTypes.Vector3;
  var Color = _flocknTypes.Color;
  var Rect = _flocknTypes.Rect;
  var addable = _flocknMixins.addable;
  var renderable = _flocknMixins.renderable;
  var updateable = _flocknMixins.updateable;
  var GameObject = (function (Base) {
    var GameObject = function GameObject(descriptor) {
      var _this = this;
      Base.call(this, "GameObject", descriptor);

      this.visible = true;

      this.position = new Vector3();

      this.fitToTexture = true;

      // Create a new texture and bind it to the `texture` property
      this.texture = new Texture();
      this.texture.parent = this;

      // Once the image is loaded, update width and height if `fitToTexture` is set
      this.texture.on("image-loaded", function () {
        if (_this.fitToTexture) {
          _this.width = _this.texture.image.width;
          _this.height = _this.texture.image.height;

          _this.origin.x = (_this.width / 2);
          _this.origin.y = (_this.height / 2);
        }

        // TODO: Evaluate if the Graphics trigger should only be in the texture
        Graphics.trigger("texture-image-loaded", _this, _this.texture);
      });

      // Once the label is loaded, update width and height if `fitToTexture` is set
      this.texture.on("label-loaded", function () {
        if (_this.fitToTexture) {
          _this.width = _this.texture.label.width;
          _this.height = _this.texture.label.height;

          _this.origin.x = (_this.width / 2);
          _this.origin.y = (_this.height / 2);

          // TODO: Evaluate if the Graphics trigger should only be in the texture
          Graphics.trigger("texture-label-loaded", _this, _this.texture);
        }
      });

      this.width = 0;
      this.height = 0;

      this.angle = 0;

      this.alpha = 1;

      this.scale = new Vector2(1, 1);

      this.origin = new Vector2(this.width / 2, this.width / 2);

      this.border = {
        width: 0,
        color: new Color(),
        radius: 0
      };

      // Add default model
      var defaultModel = new Model();
      defaultModel.name = "default";

      this.addModel(defaultModel);

      // Mix in renderable and updateable
      renderable.call(this);
      updateable.call(this);
    };

    _extends(GameObject, Base);

    _classProps(GameObject, {
      define: {
        writable: true,
        value: function (name, factory) {
          GameObject.store[name] = factory;
        }
      },
      fromJSON: {
        writable: true,
        value: function () {}
      },
      fromString: {
        writable: true,
        value: function () {}
      }
    }, {
      left: {
        get: function () {
          return this.position.x;
        },
        set: function (value) {
          this.position.x = value;
        }
      },
      top: {
        get: function () {
          return this.position.y;
        },
        set: function (value) {
          this.position.y = value;
        }
      },
      right: {
        get: function () {
          return this.parent.width - this.width - this.position.x;
        },
        set: function (value) {
          this.position.x = this.parent.width - this.width - value;
        }
      },
      bottom: {
        get: function () {
          return this.parent.height - this.height - this.position.y;
        },
        set: function (value) {
          this.position.y = this.parent.height - this.height - value;
        }
      },
      bounds: {
        writable: true,
        value: function () {
          // TODO: Also take care of scale
          // TODO: Also take care of rotation
          return new Rect(this.position.x, this.position.y, this.width, this.height);
        }
      },
      addGameObject: {
        writable: true,
        value: function () {
          // Add a game object to this game object
          this.queue.push(addable(GameObject, this.children).apply(this, arguments));
        }
      },
      addBehavior: {
        writable: true,
        value: function () {
          // Add a `Behavior` instance to the the game object and update the `gameObject` property
          this.queue.push(addable(Behavior, this.children, function (child) {
            child.gameObject = this;
          }).apply(this, arguments));
        }
      },
      addModel: {
        writable: true,
        value: function () {
          // Add a `Model` instance to the game object
          this.queue.push(addable(Model, this.children).apply(this, arguments));
        }
      },
      removeGameObject: {
        writable: true,
        value: function () {}
      },
      removeBehavior: {
        writable: true,
        value: function () {}
      },
      removeModel: {
        writable: true,
        value: function () {}
      },
      data: {
        writable: true,
        value: function (name) {
          if (!name) {
            return this.models.byName("default");
          } else {
            return this.models.byName(name);
          }
        }
      },
      toJSON: {
        writable: true,
        value: function () {
          // Serialize this object
          return serialize(this);
        }
      },
      animate: {
        writable: true,
        value: function (property, end, time, callback) {
          // TODO: Tweening does not work yet
          if (typeof this[property] === "number") {
            var distance = end - this[property];
            var timeInS = (time / 1000);

            var animateName = "animate-" + Date.now();
            this.on(animateName, function (dt) {
              this.off(animateName);
            });
          }
        }
      }
    });

    return GameObject;
  })(Base);

  GameObject.store = {};

  exports.default = GameObject;
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/graphics', ["exports", "eventmap"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("eventmap"));
  }
})(function (exports, _eventmap) {
  "use strict";

  var EventMap = _eventmap;


  // `Graphics` is an instance of an `EventMap`
  var Graphics = new EventMap();

  // Special property `renderer` can be modified, but not deleted
  Object.defineProperty(Graphics, "renderer", {
    value: null,
    writable: true,
    enumerable: true
  });

  exports.default = Graphics;
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/graphics/rootelement', ["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  }
})(function (exports) {
  "use strict";

  var createRootElement = function createRootElement(elementName, extraFn) {
    // Sets the container name: If none is given, set the id of the object.
    // If a `#` is prepended to the string, cut it off
    var containerName = (function () {
      if (this.container == null) {
        this.container = this.id;
        return this.container;
      } else {
        if (this.container.indexOf("#") === 0) {
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

    rootElement.className = [this.type.toLowerCase(), this.name.toLowerCase()].join(" ");

    // Set the dimensions of the `rootElement`
    rootElement.style.position = "absolute";
    rootElement.style.width = this.width + "px";
    rootElement.style.height = this.height + "px";

    // Allow some extra functionality to happen here.
    // It should be called on the same context and the
    // `rootElement` is passed in as a parameter
    extraFn.call(this, rootElement);

    // Center the element if it's smaller than the inside of the browser's window
    if (this.width < window.innerWidth) {
      rootElement.style.left = "50%";
      rootElement.style.marginLeft = (this.width * (-0.5)) + "px";
    }

    if (this.height < window.innerHeight) {
      rootElement.style.top = "50%";
      rootElement.style.marginTop = (this.width * (-0.5)) + "px";
    }

    // Return the element, in case someone wants to meddle with it
    return rootElement;
  };

  exports.default = createRootElement;
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/group', ["exports", "gameboard"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("gameboard"));
  }
})(function (exports, _gameboard) {
  "use strict";

  var _classProps = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var Log = _gameboard.Log;


  var unidentified = "untitled";
  var unidentifiedCounter = 0;

  var Group = (function () {
    var Group = function Group() {
      this.length = 0;

      this.ids = {};
      this.tags = {};
      this.names = {};
      this.types = {};
    };

    _classProps(Group, {
      fromJSON: {
        writable: true,
        value: function (arr) {
          var group = new Group();

          arr.forEach(function (obj) {
            return group.push(obj);
          });

          return group;
        }
      },
      fromString: {
        writable: true,
        value: function (str) {
          return Group.fromJSON(JSON.parse(str));
        }
      }
    }, {
      push: {
        writable: true,
        value: function (obj) {
          var _this = this;
          var name = obj.name;
          var tags = obj.tags;
          var id = obj.id;


          name = name || (unidentified + unidentifiedCounter++);
          id = id || (unidentified + unidentifiedCounter++);
          tags = tags || [];

          if (this.ids[id] != null || this.names[name] != null) {
            Log.w("An object with the name " + name + " or id " + id + " already exists");
            return;
          }

          var currentLength = Object.keys(this.ids);
          this.ids[id] = obj;

          Object.keys(this.tags).forEach(function (tag) {
            _this.tags[tag] = _this.tags[tag] || [];
            _this.tags[tag].push(currentLength);
          });

          this.names[name] = this.length;

          if (obj.type != null) {
            this.types[obj.type] = this.types[obj.type] || [];
            this.types[obj.type].push(currentLength);
          }

          this.length = this.values().length;
          return this.length;
        }
      },
      pop: {
        writable: true,
        value: function () {
          var ids = Object.keys(this.ids);

          for (var i = ids.length, j = 0; j > i; i--) {
            var obj = this.ids[ids[i]];

            if (obj != null) {
              this.remove(i);
              return obj;
            }
          }
        }
      },
      values: {
        writable: true,
        value: function () {
          var _this2 = this;
          return Object.keys(this.ids).filter(function (id) {
            return id != null;
          }).map(function (id) {
            return _this2.ids[id];
          });
        }
      },
      all: {
        writable: true,
        value: function (filter) {
          var objects = [];

          var recurse = function (group) {
            group.forEach(function (obj) {
              if (filter) {
                if (filter(obj)) {
                  objects.push(obj);
                }
              } else {
                objects.push(obj);
              }

              if (obj.children && obj.children instanceof Group) {
                recurse(obj.children);
              }
            });
          };

          recurse(this);

          return objects;
        }
      },
      forEach: {
        writable: true,
        value: function (callback) {
          this.values().forEach(function (obj) {
            return callback(obj);
          });
        }
      },
      map: {
        writable: true,
        value: function (callback) {
          var mappedArray = new Group();

          this.forEach(function (obj) {
            return mappedArray.push(callback(obj));
          });

          return mappedArray;
        }
      },
      filter: {
        writable: true,
        value: function (callback) {
          var filteredArray = new Group();

          this.forEach(function (obj) {
            if (callback(obj)) {
              filteredArray.push(obj);
            }
          });

          return filteredArray;
        }
      },
      byType: {
        writable: true,
        value: function (type) {
          var _this3 = this;
          return this.types[type].map(function (index) {
            return _this3[index];
          });
        }
      },
      byName: {
        writable: true,
        value: function (name) {
          var index = this.names[name];

          return this.ids[Object.keys(this.ids)[index]];
        }
      },
      byTag: {
        writable: true,
        value: function (tag) {
          var _this4 = this;
          return this.tags[tag].map(function (index) {
            return _this4[index];
          });
        }
      },
      first: {
        writable: true,
        value: function () {
          return this.values()[0];
        }
      },
      last: {
        writable: true,
        value: function () {
          var values = this.values();

          return values[values.length - 1];
        }
      },
      select: {
        writable: true,
        value: function (selector) {}
      },
      toJSON: {
        writable: true,
        value: function () {
          return this.values();
        }
      },
      toString: {
        writable: true,
        value: function () {
          return JSON.stringify(this.values());
        }
      },
      remove: {
        writable: true,
        value: function (index) {
          var _this5 = this;
          var id = Object.keys(ids)[index];

          var obj = this.ids[id];

          if (obj == null) {
            Log.w("Object at " + index + " does not exist");
          }

          var name = obj.name;
          var tags = obj.tags;


          this.ids[id] = null;
          this.names[name] = null;

          this.tags.forEach(function (tag) {
            var position = tag.indexOf(index);

            if (position >= 0) {
              if (tag.length === 1) {
                _this5.tags[tag] = [];
              } else {
                _this5.tags[tag].splice(position, 1);
              }
            }
          });

          this.length = all().length;
        }
      },
      removeByName: {
        writable: true,
        value: function (name) {
          var index = this.names[name];
          this.remove(index);
        }
      },
      removeByTag: {
        writable: true,
        value: function (tags) {
          var _this6 = this;
          if (!Array.isArray(tags)) {
            tags = [tags];
          }

          tags.forEach(function (tag) {
            _this6.tags[tag].forEach(function (index) {
              return _this6.remove(index);
            });
            _this6.tags = [];
          });
        }
      }
    });

    return Group;
  })();

  exports.default = Group;
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/input/mouse', ["exports", "flockn/types/vector2"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("flockn/types/vector2"));
  }
})(function (exports, _flocknTypesVector2) {
  "use strict";

  var Vector2 = _flocknTypesVector2.default;


  var events = ["click", "mousedown", "mouseup", "mouseover"];

  var absolutePosition = function (event, rootElement) {
    return new Vector2(event.pageX - rootElement.offsetLeft, event.pageY - rootElement.offsetTop);
  };

  var relativePosition = function (event, rootElement, offset) {
    // Normalize offset
    var offsetVector = (Object.hasOwnProperty.call(offset, "x") && Object.hasOwnProperty.call(offset, "y")) ? offset : new Vector2(offset.left, offset.top);

    return absolutePosition(event, rootElement).subtract(offsetVector);
  };

  exports.events = events;
  exports.absolutePosition = absolutePosition;
  exports.relativePosition = relativePosition;
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/mixins/addable', ["exports", "flockn/graphics"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("flockn/graphics"));
  }
})(function (exports, _flocknGraphics) {
  "use strict";

  var _slice = Array.prototype.slice;
  var Graphics = _flocknGraphics.default;


  var addable = function addable(Factory, groupInstance, extraFn) {
    var adder = function adder(child) {
      var args = _slice.call(arguments, 1);

      if (!(child instanceof Factory)) {
        if (typeof child === "string") {
          if (Object.hasOwnProperty.call(Factory.store, child)) {
            child = new Factory(Factory.store[child]);
          }
        } else {
          if (typeof child === "function") {
            child = new Factory(child);
          } else {
            // TODO: This should be also able to deep assign properties
            child = new Factory(function () {
              Object.keys(child).forEach(function (key) {
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

      Graphics.trigger("add", child);

      // Only call apply if it's available. Models for example don't have one
      if (child.apply) {
        child.apply(args);
      }

      child.trigger("add", child, args);
    };

    return function () {
      var args = [].slice.call(arguments);
      args.unshift(this);

      return adder.bind.apply(adder, args);
    };
  };

  exports.default = addable;
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/mixins', ["exports", "flockn/mixins/addable", "flockn/mixins/renderable", "flockn/mixins/updateable"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("flockn/mixins/addable"), require("flockn/mixins/renderable"), require("flockn/mixins/updateable"));
  }
})(function (exports, _flocknMixinsAddable, _flocknMixinsRenderable, _flocknMixinsUpdateable) {
  "use strict";

  var addable = _flocknMixinsAddable.default;
  var renderable = _flocknMixinsRenderable.default;
  var updateable = _flocknMixinsUpdateable.default;
  exports.addable = addable;
  exports.renderable = renderable;
  exports.updateable = updateable;
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/mixins/renderable', ["exports", "flockn/utils/checkforflag", "flockn/graphics"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("flockn/utils/checkforflag"), require("flockn/graphics"));
  }
})(function (exports, _flocknUtilsCheckforflag, _flocknGraphics) {
  "use strict";

  var checkForFlag = _flocknUtilsCheckforflag.default;
  var Graphics = _flocknGraphics.default;


  var isVisible = checkForFlag("visible");

  var renderable = function renderable() {
    var _this = this;
    this.on("render", function () {
      // Only render if element is visible
      if (!isVisible.call(_this)) {
        return;
      }

      // Emit `render` event on the `Graphics` object
      Graphics.trigger("render", _this);

      // Render all children elements
      _this.children.forEach(function (child) {
        return child.trigger("render");
      });
    });
  };

  exports.default = renderable;
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/mixins/updateable', ["exports", "flockn/utils/checkforflag"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("flockn/utils/checkforflag"));
  }
})(function (exports, _flocknUtilsCheckforflag) {
  "use strict";

  var checkForFlag = _flocknUtilsCheckforflag.default;


  var isStatic = checkForFlag("static");

  // TODO: This is not completely how I want it be as it only sets the children as static and not the element itself
  // TODO: Evaluate if it's a good idea if static elements shouldn't be able to interact with similar to PIXI's
  //  interactive property
  var updatable = function updateable() {
    var _this = this;
    // Update all children
    this.on("update", function (dt) {
      if (!isStatic.call(_this)) {
        return;
      }

      _this.children.forEach(function (child) {
        if (child.update) {
          child.trigger("update", dt);
        }
      });
    });
  };

  exports.default = updatable;
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/model', ["exports", "eventmap"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("eventmap"));
  }
})(function (exports, _eventmap) {
  "use strict";

  var _classProps = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var _extends = function (child, parent) {
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

  var EventMap = _eventmap.default;
  var Model = (function (EventMap) {
    var Model = function Model() {
      EventMap.call(this);

      // Store attribute data
      this.data = {};
    };

    _extends(Model, EventMap);

    _classProps(Model, null, {
      get: {
        writable: true,
        value: function () {
          // Get an attribute if it exists
          if (Object.hasOwnProperty.call(this.data, name)) {
            return this.data[name];
          }
        }
      },
      set: {
        writable: true,
        value: function (name, value) {
          // Set or add an attribute
          this.data[name] = value;
          // Trigger the `change` event with `name` and `value` as its parameters
          this.trigger("change", name, value);
        }
      },
      has: {
        writable: true,
        value: function (name) {
          return Object.hasOwnProperty.call(this.data, name);
        }
      }
    });

    return Model;
  })(EventMap);

  exports.default = Model;
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/plugins/collision', ["exports", "flockn/behavior"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("flockn/behavior"));
  }
})(function (exports, _flocknBehavior) {
  "use strict";

  var Behavior = _flocknBehavior.default;


  Behavior.define("collision", function () {
    this.update(function (dt) {});
  });
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/plugins/movement', ["exports", "flockn/behavior", "flockn/model", "gameboard"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("flockn/behavior"), require("flockn/model"), require("gameboard"));
  }
})(function (exports, _flocknBehavior, _flocknModel, _gameboard) {
  "use strict";

  var Behavior = _flocknBehavior.default;
  var Model = _flocknModel.default;
  var Input = _gameboard.Input;


  var keyData = new Model();

  keyData.name = "keys";
  keyData.set("up", ["up", "w"]);
  keyData.set("down", ["down", "s"]);
  keyData.set("left", ["left", "a"]);
  keyData.set("right", ["right", "d"]);

  var movements = ["up", "down", "left", "right"];

  Behavior.define("movement", function () {
    var _this = this;


    this.addModel(keyData);

    this.input.key.on("down", function (key) {
      var upKeys = _this.data("keys").get("up");
      if (!Array.isArray(upKeys)) {
        upKeys = [upKeys];
      }

      _this.trigger("up");
      _this.trigger("down");
      _this.trigger("left");
      _this.trigger("right");
    });
  });
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/plugins/spriteanimation', ["exports", "flockn/behavior"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("flockn/behavior"));
  }
})(function (exports, _flocknBehavior) {
  "use strict";

  var Behavior = _flocknBehavior.default;


  Behavior.define("sprite-animation", function () {});
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/renderer/canvas', ["exports", "flockn/types", "flockn/graphics", "flockn/graphics/rootelement", "flockn/input/mouse"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("flockn/types"), require("flockn/graphics"), require("flockn/graphics/rootelement"), require("flockn/input/mouse"));
  }
})(function (exports, _flocknTypes, _flocknGraphics, _flocknGraphicsRootelement, _flocknInputMouse) {
  "use strict";

  var Vector2 = _flocknTypes.Vector2;
  var Graphics = _flocknGraphics.default;
  var createRootElement = _flocknGraphicsRootelement.default;
  var mouse = _flocknInputMouse;


  Graphics.renderer = "Canvas";

  var rootElement = null;
  var context = null;

  Graphics.on("initialize", function (Game) {
    rootElement = createRootElement.call(Game, "canvas", function (rootElement) {
      rootElement.width = Game.width;
      rootElement.height = Game.height;
      context = rootElement.getContext("2d");
    });

    mouse.events.forEach(function (eventName) {
      rootElement.addEventListener(eventName, function (e) {
        if (Game.activeScene) {
          Game.activeScene.children.all(function (obj) {
            return obj.visible && obj.bounds().contains(mouse.relativePosition(e, rootElement, obj));
          }).forEach(function (obj) {
            return obj.trigger(eventName, mouse.relativePosition(e, rootElement, obj));
          });
        }
      });
    });
  });

  Graphics.before("render", function (obj) {
    switch (obj.type) {
      case "Game":
        context.clearRect(0, 0, obj.width, obj.height);

        context.fillStyle = obj.color.toString();
        context.fillRect(0, 0, obj.width, obj.height);
        break;
      default:
        break;
    }
  });

  Graphics.on("render", function (obj) {
    switch (obj.type) {
      case "GameObject":
        context.save();

        context.translate(obj.position.x + obj.origin.x, obj.position.y + obj.origin.y);

        if (obj.angle !== 0) {
          context.rotate(obj.angle * (Math.PI / 180));
        }

        if (obj.texture.color.toString() !== "transparent") {
          context.fillStyle = obj.texture.color.toString();
          context.fillRect(-obj.origin.x, -obj.origin.y, obj.width, obj.height);
        }

        if (obj.texture.image.drawable) {
          context.drawImage(obj.texture.image.data, -obj.origin.x, -obj.origin.y);
        }

        if (obj.texture.label.drawable) {
          var fontName = obj.texture.label.font.size + "px " + obj.texture.label.font.name;

          context.fillStyle = obj.texture.label.font.color.toString();
          context.fillText(obj.texture.label.text, -obj.origin.x, -obj.origin.y);
        }

        context.restore();
        break;
      case "Scene":
        if (obj.parent.activeScene !== obj.name) {
          return;
        }
        break;
      default:
        break;
    }
  });
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/renderer/dom', ["exports", "flockn/graphics", "flockn/graphics/rootelement", "flockn/input/mouse"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("flockn/graphics"), require("flockn/graphics/rootelement"), require("flockn/input/mouse"));
  }
})(function (exports, _flocknGraphics, _flocknGraphicsRootelement, _flocknInputMouse) {
  "use strict";

  var Graphics = _flocknGraphics.default;
  var createRootElement = _flocknGraphicsRootelement.default;
  var mouse = _flocknInputMouse;


  var root = window;

  var pixelize = function (num) {
    return num + "px";
  };

  var unpixelize = function (str) {
    return parseFloat(str) || 0;
  };

  Graphics.renderer = "DOM";

  var rootElement = null;

  Graphics.on("initialize", function (Game) {
    rootElement = createRootElement.call(Game, "div", function (rootElement) {
      rootElement.style.backgroundColor = this.color.toString();
      rootElement.style.overflow = "hidden";
      rootElement.style.cursor = "default";
      rootElement.style.userSelect = rootElement.style.mozUserSelect = rootElement.style.webkitUserSelect = "none";
    });
  });

  Graphics.on("add", function (obj) {
    var elementId = obj.id.toLowerCase();

    // Remove previous elements of the same id
    if (document.getElementById(elementId) != null) {
      (function () {
        var parentId = obj.parent.id.toLowerCase();

        var parentElem = document.getElementById(parentId);
        parentElem.removeChild(document.getElementById(elementId));
      })();
    }

    var parent = obj.parent;

    var parentElem = (function () {
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

    var element = document.createElement("div");
    element.id = elementId;
    element.className = [obj.type.toLowerCase(), obj.name.toLowerCase()].join(" ");
    element.style.position = "absolute";

    switch (obj.type) {
      case "Scene":
        element.style.width = pixelize(obj.parent.width);
        element.style.height = pixelize(obj.parent.height);
        break;
      case "GameObject":
        element.style.left = pixelize(obj.position.x);
        element.style.top = pixelize(obj.position.y);
        element.style.width = pixelize(obj.width);
        element.style.height = pixelize(obj.height);

        mouse.events.forEach(function (eventName) {
          root.addEventListener(eventName, function (evt) {
            obj.trigger(mouse.relativePosition(evt, rootElement, obj));
          });
        });


        // Mouseenter and Mouseleave are kinda special right now
        root.addEventListener("mouseenter", function (evt) {
          obj.trigger("mouseenter", evt);
        }, true);

        root.addEventListener("mouseleave", function (evt) {
          obj.trigger("mouseleave", evt);
        }, true);

        break;
      default:
        break;
    }

    parentElem.appendChild(element);
  });

  Graphics.on("texture-image-loaded", function (obj, texture) {
    var element = document.getElementById(obj.id.toLowerCase());

    if (element != null) {
      element.style.backgroundImage = "url(" + texture.image.filename + ")";
      element.style.width = pixelize(obj.width);
      element.style.height = pixelize(obj.height);
    }
  });

  Graphics.on("texture-label-loaded", function (obj, texture) {
    var element = document.getElementById(obj.id.toLowerCase());

    if (element != null) {
      element.style.width = pixelize(obj.width);
      element.style.height = pixelize(obj.height);
    }
  });

  var dirtyObjects = {};

  Graphics.after("render", function (obj) {
    var objId = obj.id.toLowerCase();

    dirtyObjects[objId] = obj;
  });

  Graphics.on("render", function (obj) {
    var objId = obj.id.toLowerCase();

    // Update element attributes
    var element = document.getElementById(objId);

    if (element != null) {
      var prevObj = dirtyObjects[objId] || {};

      switch (obj.type) {
        case "GameObject":
          var elemVisible = element.style.display === "block";

          if (elemVisible !== obj.visible) {
            element.style.display = (obj.visible) ? "block" : "hidden";
          }

          if (!elemVisible) {
            return;
          }

          var elemX = unpixelize(element.style.left);
          var elemY = unpixelize(element.style.top);
          var elemWidth = unpixelize(element.style.width);
          var elemHeight = unpixelize(element.style.height);

          if (elemX !== obj.position.x) {
            element.style.left = pixelize(obj.position.x);
          }

          if (elemY !== obj.position.y) {
            element.style.top = pixelize(obj.position.y);
          }

          if (elemWidth !== obj.width) {
            element.style.width = pixelize(obj.width);
          }

          if (elemHeight !== obj.height) {
            element.style.height = pixelize(obj.height);
          }

          if (obj.angle) {
            element.style.transform = element.style.mozTransform = element.style.webkitTransform = "rotate(" + obj.angle + "deg)";
          }

          if (obj.alpha !== 1) {
            element.style.opacity = obj.alpha;
          }

          // Set background color
          element.style.backgroundColor = obj.texture.color.toString();

          // Set origin
          element.style.transformOrigin = element.style.mozTransformOrigin = element.webkitTransformOrigin = obj.origin.x + "px " + obj.origin.y + "px";

          // Set border
          if (obj.border.width > 0) {
            element.style.borderWidth = pixelize(obj.border.width);
            element.style.borderStyle = "solid";
            element.style.borderColor = obj.border.color.toString();

            if (obj.border.radius > 0) {
              element.style.borderRadius = pixelize(obj.border.radius);
            }
          }

          if (obj.texture.image.drawable) {
            if (obj.texture.image.offset.x !== 0) {
              element.style.backgroundPositionX = obj.texture.image.offset.x * (-1) + "px";
            }

            if (obj.texture.image.offset.y !== 0) {
              element.style.backgroundPositionY = obj.texture.image.offset.y * (-1) + "px";
            }
          }

          if (obj.texture.label.drawable) {
            element.innerText = obj.texture.label.text;

            element.style.whiteSpace = "nowrap";

            if (obj.texture.label.font.size) {
              element.style.fontSize = pixelize(obj.texture.label.font.size);
            }

            if (obj.texture.label.font.color) {
              element.style.color = obj.texture.label.font.color.toString();
            }

            if (obj.texture.label.font.name) {
              element.style.fontFamily = obj.texture.label.font.name;
            }

            obj.texture.label.font.decoration.forEach(function (decoration) {
              switch (decoration) {
                case "bold":
                  element.style.fontWeight = "bold";
                  break;
                case "italic":
                  element.style.fontStyle = "italic";
                  break;
                case "underline":
                  element.style.textDecoration = "underline";
                  break;
                default:
                  break;
              }
            });
          }

          break;
        case "Scene":
          var elemVisibleStyle = element.style.display;

          if (obj.parent.activeScene !== obj.name) {
            if (elemVisibleStyle !== "hidden") {
              element.style.display = "hidden";
            }
          } else {
            if (elemVisibleStyle !== "block") {
              element.style.display = "block";
            }
          }
          break;
        default:
          break;
      }
    }
  });
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/scene', ["exports", "flockn/base", "flockn/gameobject", "flockn/mixins"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("flockn/base"), require("flockn/gameobject"), require("flockn/mixins"));
  }
})(function (exports, _flocknBase, _flocknGameobject, _flocknMixins) {
  "use strict";

  var _classProps = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var _extends = function (child, parent) {
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

  var Base = _flocknBase.default;
  var GameObject = _flocknGameobject.default;
  var addable = _flocknMixins.addable;
  var renderable = _flocknMixins.renderable;
  var updateable = _flocknMixins.updateable;
  var Scene = (function (Base) {
    var Scene = function Scene(descriptor) {
      Base.call(this, "Scene", descriptor);

      this.visible = true;

      // Mix in `renderable` and `updateable`
      renderable.call(this);
      updateable.call(this);
    };

    _extends(Scene, Base);

    _classProps(Scene, {
      define: {
        writable: true,
        value: function (name, factory) {
          Scene.store[name] = factory;
        }
      }
    }, {
      addGameObject: {
        writable: true,
        value: function () {
          // Allow game objects to be added to scenes
          this.queue.push(addable(GameObject, this.children).apply(this, arguments));
        }
      }
    });

    return Scene;
  })(Base);

  exports.default = Scene;
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/serialize', ["exports", "eventmap"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("eventmap"));
  }
})(function (exports, _eventmap) {
  "use strict";

  var EventMap = _eventmap.default;


  // Serialize function to `JSON.stringify` with a custom replacer
  var serialize = function serialize(obj) {
    return JSON.stringify(obj, function (key, value) {
      // Avoiding cyclic dependencies
      if (key === "parent") {
        return;
      }

      if (key === "events" && obj instanceof EventMap) {
        value = obj.serialize();
      }

      // Use custom toString function if available
      if (typeof value === "object" && value != null && Object.hasOwnProperty.call(value, "toString")) {
        value = value.toString();
      }

      // Convert image to Base64
      if (value instanceof Image) {
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        canvas.height = this.height;
        canvas.width = this.width;
        context.drawImage(this.data, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        canvas = null;

        value = dataURL;
      }

      // Stringify the descriptor
      if (key === "descriptor") {
        value = value.toString();
      }

      return value;
    });
  };

  exports.default = serialize;
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/texture/image', ["exports", "flockn/types", "flockn/serialize"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("flockn/types"), require("flockn/serialize"));
  }
})(function (exports, _flocknTypes, _flocknSerialize) {
  "use strict";

  var _classProps = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var Color = _flocknTypes.Color;
  var Vector2 = _flocknTypes.Vector2;
  var serialize = _flocknSerialize.default;
  var TextureImage = (function () {
    var TextureImage = function TextureImage(texture) {
      // The default values for `image`
      this.color = Color.transparent;
      this.drawable = false;
      this.offset = new Vector2(0, 0);
      this.data = null;
      this.width = 0;
      this.height = 0;

      var filename = "";

      Object.defineProperty(this, "filename", {
        get: function () {
          return filename;
        },
        set: function (value) {
          var _this = this;
          filename = value;

          // TODO: Most of this should already be handled by the preloader
          var img = new Image();
          img.src = filename;

          img.onload = function () {
            _this.data = img;
            _this.width = img.width;
            _this.height = img.height;
            _this.drawable = true;

            texture.trigger("image-loaded");
          };
        },
        enumerable: true
      });
    };

    _classProps(TextureImage, null, {
      toString: {
        writable: true,
        value: function () {
          return serialize(this);
        }
      }
    });

    return TextureImage;
  })();

  exports.default = TextureImage;
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/texture', ["exports", "flockn/types", "eventmap", "flockn/texture/image", "flockn/texture/label", "flockn/serialize"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("flockn/types"), require("eventmap"), require("flockn/texture/image"), require("flockn/texture/label"), require("flockn/serialize"));
  }
})(function (exports, _flocknTypes, _eventmap, _flocknTextureImage, _flocknTextureLabel, _flocknSerialize) {
  "use strict";

  var _classProps = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var _extends = function (child, parent) {
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
  var EventMap = _eventmap.default;
  var TextureImage = _flocknTextureImage.default;
  var TextureLabel = _flocknTextureLabel.default;
  var serialize = _flocknSerialize.default;
  var Texture = (function (EventMap) {
    var Texture = function Texture() {
      EventMap.call(this);

      var self = this;

      // Set up dimensions
      this.width = 0;
      this.height = 0;

      // Set parent property
      this.parent = null;

      this.image = new TextureImage(this);
      this.label = new TextureLabel(this);

      this.color = Color.white;
    };

    _extends(Texture, EventMap);

    _classProps(Texture, null, {
      toString: {
        writable: true,
        value: function () {
          return serialize(this);
        }
      }
    });

    return Texture;
  })(EventMap);

  exports.default = Texture;
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/texture/label', ["exports", "flockn/types", "flockn/serialize"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("flockn/types"), require("flockn/serialize"));
  }
})(function (exports, _flocknTypes, _flocknSerialize) {
  "use strict";

  var _classProps = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var Color = _flocknTypes.Color;
  var serialize = _flocknSerialize.default;
  var TextureLabel = (function () {
    var TextureLabel = function TextureLabel(texture) {
      // Default value for `label`
      this.drawable = false;
      this.font = {
        size: 10,
        name: "Arial",
        color: Color.black,
        decoration: []
      };

      this.align = {
        x: "center",
        y: "center"
      };
      this.width = 0;
      this.height = 0;

      var text = "";

      Object.defineProperty(this, "text", {
        get: function () {
          return text;
        },
        set: function (value) {
          text = value;

          // Calculate the size of the label and update the dimensions
          // TODO: This should be handled somewhere else, but I'm not sure where
          var tmpElem = document.createElement("div");
          tmpElem.innerText = text;
          tmpElem.style.position = "absolute";
          tmpElem.style.left = "-9999px";
          tmpElem.style.top = "-9999px";
          tmpElem.style.fontSize = this.font.size + "px";
          tmpElem.style.fontFamily = this.font.name;
          tmpElem.style.color = this.font.color;

          this.font.decoration.forEach(function (decoration) {
            switch (decoration) {
              case "bold":
                tmpElem.style.fontWeight = "bold";
                break;
              case "italic":
                tmpElem.style.fontStyle = "italic";
                break;
              case "underline":
                tmpElem.style.textDecoration = "underline";
                break;
              default:
                break;
            }
          });

          document.body.appendChild(tmpElem);

          this.width = tmpElem.clientWidth;
          this.height = tmpElem.clientHeight;
          this.drawable = true;

          document.body.removeChild(tmpElem);

          texture.trigger("label-loaded");
        }
      });
    };

    _classProps(TextureLabel, null, {
      toString: {
        writable: true,
        value: function () {
          return serialize(this);
        }
      }
    });

    return TextureLabel;
  })();

  exports.default = TextureLabel;
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/types/color', ["exports", "clamp", "flockn/constants/color"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("clamp"), require("flockn/constants/color"));
  }
})(function (exports, _clamp, _flocknConstantsColor) {
  "use strict";

  var _classProps = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var clamp = _clamp;
  var colorConstants = _flocknConstantsColor.default;
  var Color = (function () {
    var Color = function Color(r, g, b, a) {
      if (a === undefined) a = 1;
      if (b === undefined) b = 0;
      if (g === undefined) g = 0;
      if (r === undefined) r = 0;
      this.set(r, g, b, a);
    };

    _classProps(Color, {
      random: {
        writable: true,
        value: function () {
          var col = [0, 0, 0];

          col = col.map(function () {
            return ~ ~(Math.random() * 255);
          });

          return new Color(col[0], col[1], col[2]);
        }
      }
    }, {
      set: {
        writable: true,
        value: function (r, g, b, a) {
          if (a === undefined) a = 1;
          if (b === undefined) b = 0;
          if (g === undefined) g = 0;
          if (r === undefined) r = 0;
          this.r = r;
          this.g = g;
          this.b = b;
          this.a = a;
        }
      },
      lighten: {
        writable: true,
        value: function (factor) {
          factor = clamp(factor, 0, 1);

          this.r = clamp(this.r + (factor * 255) | 0, 0, 255);
          this.g = clamp(this.g + (factor * 255) | 0, 0, 255);
          this.b = clamp(this.b + (factor * 255) | 0, 0, 255);
        }
      },
      darken: {
        writable: true,
        value: function (factor) {
          factor = clamp(factor, 0, 1);

          this.r = clamp(this.r - (factor * 255) | 0, 0, 255);
          this.g = clamp(this.g - (factor * 255) | 0, 0, 255);
          this.b = clamp(this.b - (factor * 255) | 0, 0, 255);
        }
      },
      fadeIn: {
        writable: true,
        value: function (factor) {
          factor = clamp(factor, 0, 1);

          this.a = this.a + this.a * factor;
          if (this.a > 1) {
            this.a = 1;
          }
        }
      },
      fadeOut: {
        writable: true,
        value: function (factor) {
          factor = clamp(factor, 0, 1);

          this.a = this.a - this.a * factor;
          if (this.a < 0) {
            this.a = 0;
          }
        }
      },
      toString: {
        writable: true,
        value: function () {
          if (this.a < 1) {
            if (this.a === 0) {
              return "transparent";
            } else {
              return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
            }
          } else {
            return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
          }
        }
      },
      toHex: {
        writable: true,
        value: function () {
          return "#" + this.r.toString(16) + "" + this.g.toString(16) + "" + this.b.toString(16);
        }
      }
    });

    return Color;
  })();

  // TODO: Reflect if it wouldn't be better to use functions rather than custom properties
  for (var colorName in colorConstants) {
    var colorValue = colorConstants[colorName];
    Object.defineProperty(Color, colorName, {
      get: function () {
        var col = new Color(colorValue.r, colorValue.g, colorValue.b, colorValue.a);
        col.name = colorName;
        return col;
      }
    });
  }

  exports.default = Color;
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/types', ["exports", "flockn/types/color", "flockn/types/vector2", "flockn/types/vector3", "flockn/types/rect"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("flockn/types/color"), require("flockn/types/vector2"), require("flockn/types/vector3"), require("flockn/types/rect"));
  }
})(function (exports, _flocknTypesColor, _flocknTypesVector2, _flocknTypesVector3, _flocknTypesRect) {
  "use strict";

  var Color = _flocknTypesColor.default;
  var Vector2 = _flocknTypesVector2.default;
  var Vector3 = _flocknTypesVector3.default;
  var Rect = _flocknTypesRect.default;


  var Types = {};

  Types.Color = Color;
  Types.Vector2 = Vector2;
  Types.Vector3 = Vector3;
  Types.Rect = Rect;

  exports.default = Types;
  exports.Color = Color;
  exports.Vector2 = Vector2;
  exports.Vector3 = Vector3;
  exports.Rect = Rect;
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/types/rect', ["exports", "flockn/types/vector2"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("flockn/types/vector2"));
  }
})(function (exports, _flocknTypesVector2) {
  "use strict";

  var _classProps = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var Vector2 = _flocknTypesVector2.default;
  var Rect = (function () {
    var Rect = function Rect(x, y, w, h) {
      if (h === undefined) h = 0;
      if (w === undefined) w = 0;
      if (y === undefined) y = 0;
      if (x === undefined) x = 0;
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
    };

    _classProps(Rect, {
      fromString: {
        writable: true,
        value: function (str) {
          var obj = JSON.parse(str);

          return new Rect(obj.x, obj.y, obj.w, obj.h);
        }
      }
    }, {
      toString: {
        writable: true,
        value: function () {
          return JSON.stringify({
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h
          });
        }
      },
      center: {
        writable: true,
        value: function () {
          return new Vector2(this.w / 2, this.h / 2);
        }
      },
      contains: {
        writable: true,
        value: function (vector) {
          return (vector.x >= this.x) && (vector.y >= this.y) && (vector.x < this.x + this.w) && (vector.y < this.y + this.h);
        }
      }
    });

    return Rect;
  })();

  exports.default = Rect;
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/types/vector2', ["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  }
})(function (exports) {
  "use strict";

  var _classProps = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var sqrMagnitude = function (v) {
    return Vector2.dot(v, v);
  };

  var Vector2 = (function () {
    var Vector2 = function Vector2(x, y) {
      if (y === undefined) y = 0;
      if (x === undefined) x = 0;
      this.set(x, y);
    };

    _classProps(Vector2, {
      dot: {
        writable: true,
        value: function (vec1, vec2) {
          return vec1.x * vec2.x + vec1.y * vec2.y;
        }
      },
      fromAngle: {
        writable: true,
        value: function (angle, magnitude) {
          return new Vector2(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
        }
      },
      fromString: {
        writable: true,
        value: function (str) {
          var obj = JSON.parse(str);

          return new Vector2(obj.x, obj.y);
        }
      }
    }, {
      set: {
        writable: true,
        value: function (x, y) {
          if (y === undefined) y = 0;
          if (x === undefined) x = 0;
          this.x = x;
          this.y = y;
        }
      },
      magnitude: {
        get: function () {
          return Math.sqrt(sqrMagnitude(this));
        }
      },
      sqrMagnitude: {
        get: function () {
          return sqrMagnitude(this);
        }
      },
      angle: {
        get: function () {
          return Math.atan2(this.x, this.y);
        }
      },
      toString: {
        writable: true,
        value: function () {
          return JSON.stringify({ x: this.x, y: this.y });
        }
      },
      clone: {
        writable: true,
        value: function () {
          return new Vector2(this.x, this.y);
        }
      },
      add: {
        writable: true,
        value: function (vector) {
          this.x += vector.x;
          this.y += vector.y;

          return this;
        }
      },
      subtract: {
        writable: true,
        value: function (vector) {
          this.x -= vector.x;
          this.y -= vector.y;

          return this;
        }
      },
      multiply: {
        writable: true,
        value: function (vector) {
          this.x *= vector.x;
          this.y *= vector.y;

          return this;
        }
      },
      divide: {
        writable: true,
        value: function (vector) {
          this.x /= vector.x;
          this.y /= vector.y;

          return this;
        }
      },
      normalize: {
        writable: true,
        value: function () {
          this.x = this.x / this.magnitude;
          this.y = this.y / this.magnitude;

          return this;
        }
      },
      equals: {
        writable: true,
        value: function (v) {
          return (this.x === v.x && this.y === v.y);
        }
      }
    });

    return Vector2;
  })();

  exports.default = Vector2;
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/types/vector3', ["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  }
})(function (exports) {
  "use strict";

  var _classProps = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var sqrMagnitude = function (v) {
    return Vector3.dot(v, v);
  };

  var Vector3 = (function () {
    var Vector3 = function Vector3(x, y, z) {
      if (z === undefined) z = 0;
      if (y === undefined) y = 0;
      if (x === undefined) x = 0;
      this.set(x, y, z);
    };

    _classProps(Vector3, {
      dot: {
        writable: true,
        value: function (vec1, vec2) {
          return vec1.x * vec2.x + vec1.y * vec2.y + vec1.z * vec2.z;
        }
      },
      cross: {
        writable: true,
        value: function (vec1, vec2) {
          return new Vector3(vec1.y * vec2.z - vec2.y * vec1.z, vec1.z * vec2.x - vec2.z * vec1.x, vec1.x * vec2.y - vec2.x * vec1.y);
        }
      },
      fromString: {
        writable: true,
        value: function (str) {
          var obj = JSON.parse(str);

          return new Vector3(obj.x, obj.y, obj.z);
        }
      },
      forward: {
        writable: true,
        value: function () {
          return new Vector3(0, 0, 1);
        }
      },
      right: {
        writable: true,
        value: function () {
          return new Vector3(1, 0, 0);
        }
      },
      one: {
        writable: true,
        value: function () {
          return new Vector3(1, 1, 1);
        }
      },
      up: {
        writable: true,
        value: function () {
          return new Vector3(0, 1, 0);
        }
      },
      zero: {
        writable: true,
        value: function () {
          return new Vector3(0, 0, 0);
        }
      }
    }, {
      set: {
        writable: true,
        value: function (x, y, z) {
          if (z === undefined) z = 0;
          if (y === undefined) y = 0;
          if (x === undefined) x = 0;
          this.x = x;
          this.y = y;
          this.z = z;
        }
      },
      magnitude: {
        get: function () {
          return Math.sqrt(sqrMagnitude(this));
        }
      },
      sqrMagnitude: {
        get: function () {
          return sqrMagnitude(this);
        }
      },
      clone: {
        writable: true,
        value: function () {
          return new Vector2(this.x, this.y, this.z);
        }
      },
      toString: {
        writable: true,
        value: function () {
          return JSON.stringify({ x: this.x, y: this.y, z: this.z });
        }
      },
      add: {
        writable: true,
        value: function (vector) {
          this.x += vector.x;
          this.y += vector.y;
          this.z += vector.z;

          return this;
        }
      },
      subtract: {
        writable: true,
        value: function (vector) {
          this.x -= vector.x;
          this.y -= vector.y;
          this.z -= vector.z;

          return this;
        }
      },
      multiply: {
        writable: true,
        value: function (vector) {
          this.x *= vector.x;
          this.y *= vector.y;
          this.z *= vector.z;

          return this;
        }
      },
      divide: {
        writable: true,
        value: function (vector) {
          this.x /= vector.x;
          this.y /= vector.y;
          this.z /= vector.z;

          return this;
        }
      },
      normalize: {
        writable: true,
        value: function () {
          this.x = this.x / this.magnitude;
          this.y = this.y / this.magnitude;
          this.z = this.z / this.magnitude;

          return this;
        }
      },
      equals: {
        writable: true,
        value: function (v) {
          return (this.x === v.x && this.y === v.y && this.z === v.z);
        }
      }
    });

    return Vector3;
  })();

  exports.default = Vector3;
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/utils/checkforflag', ["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  }
})(function (exports) {
  "use strict";

  var checkForFlag = function checkForFlag(property) {
    return function (obj) {
      obj = obj || this;

      var hasFlag = Object.hasOwnProperty.call(obj, property);

      if (hasFlag) {
        return obj[property];
      } else {
        return true;
      }
    };
  };

  exports.default = checkForFlag;
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/viewport', ["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  }
})(function (exports) {
  "use strict";

  var Viewport = {};

  Viewport.scale = {};
  Viewport.scale.mode = "scaleToFit";
  Viewport.scale.x = 1;
  Viewport.scale.y = 1;

  Viewport.width = 800;
  Viewport.height = 600;

  exports.default = Viewport;
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/world', ["exports", "flockn/model"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("flockn/model"));
  }
})(function (exports, _flocknModel) {
  "use strict";

  var Model = _flocknModel.default;


  // `World` is an instance of a model
  var world = new Model();

  exports.default = world;
});