define('flockn/assets', ["exports", "module"], function (exports, module) {
  "use strict";

  var Assets = {};

  module.exports = Assets;
});

define('flockn/audio', ["exports", "module"], function (exports, module) {
  "use strict";

  var Audio = {};

  Audio.play = function () {};

  module.exports = Audio;
});

define('flockn/base', ["exports", "module", "eventmap", "gamebox", "flockn/audio", "flockn/group", "flockn/world"], function (exports, module, _eventmap, _gamebox, _flocknAudio, _flocknGroup, _flocknWorld) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var EventMap = _interopRequire(_eventmap);

  var Input = _gamebox.Input;

  var Audio = _interopRequire(_flocknAudio);

  var Group = _interopRequire(_flocknGroup);

  var World = _interopRequire(_flocknWorld);

  var objectIndex = 0;

  var prependMax = 10000;

  var numToIdString = function numToIdString(num) {
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

  var Base = (function (_EventMap) {
    function Base() {
      var type = arguments[0] === undefined ? "Base" : arguments[0];
      var descriptor = arguments[1] === undefined ? function () {} : arguments[1];

      _classCallCheck(this, Base);

      _EventMap.call(this);

      // Count up `objectIndex` and stringify it
      var currentObject = numToIdString(++objectIndex);

      this.type = type;

      var internalId = "" + this.type + "-" + Date.now() + "-" + currentObject;

      this.name = internalId;

      // The `id` property is read-only and returns the type and the stringified object index
      Object.defineProperty(this, "id", {
        get: function get() {
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

      // As should `Audio`
      this.audio = Audio;

      // Emit an event
      this.trigger("constructed");
    }

    _inherits(Base, _EventMap);

    Base.prototype.apply = function apply(data) {
      // TODO: Reflect if function check should be enforced here
      if (this.descriptor) {
        // If args is not an array or array-like, provide an empty one
        data = data || {};

        // Call the `descriptor` property with `args`

        // Game, world, data
        this.descriptor.call(this, data, World);

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
    };

    Base.prototype.call = function call() {
      // Call `Base#apply` with the arguments object
      this.apply(arguments);
    };

    // Alias for `Base#call`

    Base.prototype.reset = function reset() {
      return this.call.apply(this, arguments);
    };

    Base.prototype.closest = function closest() {};

    Base.prototype.find = function find() {};

    Base.prototype.log = function log() {
      if (console && console.log) {
        var argArray = [].slice.call(arguments);

        // Log with `console.log`: Prepend the type and name
        argArray.unshift(":");
        argArray.unshift(this.name);
        argArray.unshift(this.type);

        return console.log.apply(console, argArray);
      }
    };

    return Base;
  })(EventMap);

  Base.queueOrder = ["Game", "Scene", "GameObject", "Behavior", "Model"];

  module.exports = Base;
});

define('flockn/behavior', ["exports", "module", "flockn/base", "flockn/group", "flockn/mixins"], function (exports, module, _flocknBase, _flocknGroup, _flocknMixins) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var Base = _interopRequire(_flocknBase);

  var Group = _interopRequire(_flocknGroup);

  var addable = _flocknMixins.addable;
  var updateable = _flocknMixins.updateable;
  var serializable = _flocknMixins.serializable;
  var storable = _flocknMixins.storable;

  // Behaviors only provide logic. There is no rendering involved.
  // Behaviors can attach any number of behaviors to itself

  var Behavior = (function (_Base) {
    function Behavior(descriptor) {
      _classCallCheck(this, Behavior);

      _Base.call(this, "Behavior", descriptor);

      // Reference to the game object itself
      this.gameObject = null;

      // Mix in `updateable`
      updateable.call(this);
    }

    _inherits(Behavior, _Base);

    Behavior.prototype.addBehavior = function addBehavior() {
      // When a behavior is added, the reference to the game object is set
      this.queue.push(addable(Behavior, this.children, function (child) {
        child.gameObject = this.gameObject;
      }).apply(this, arguments));
    };

    Behavior.prototype.removeBehavior = function removeBehavior() {};

    return Behavior;
  })(Base);

  serializable(Behavior);
  storable(Behavior);

  module.exports = Behavior;
});

define('flockn/constants/color', ["exports", "module"], function (exports, module) {
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

  module.exports = colors;
});

define('flockn/game', ["exports", "module", "gamebox", "flockn/base", "flockn/graphics", "flockn/scene", "flockn/types/color", "flockn/viewport", "flockn/mixins"], function (exports, module, _gamebox, _flocknBase, _flocknGraphics, _flocknScene, _flocknTypesColor, _flocknViewport, _flocknMixins) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var Loop = _gamebox.Loop;
  var AssetLoader = _gamebox.AssetLoader;

  var Base = _interopRequire(_flocknBase);

  var Graphics = _interopRequire(_flocknGraphics);

  var Scene = _interopRequire(_flocknScene);

  var Color = _interopRequire(_flocknTypesColor);

  var Viewport = _interopRequire(_flocknViewport);

  var addable = _flocknMixins.addable;
  var renderable = _flocknMixins.renderable;
  var updateable = _flocknMixins.updateable;
  var serializable = _flocknMixins.serializable;

  var root = window;

  // Game is the entry point for all games made with flockn.
  // Any number of `Scene` instances can be attached to a `Game` instance

  var Game = (function (_Base) {
    function Game(descriptor) {
      var _this = this;

      _classCallCheck(this, Game);

      // Extend the `Base` class
      _Base.call(this, "Game", descriptor);

      // `this.container` is a string, which is the id of the element.
      // If it's not given, it should create a new element. This should be handled by the renderer.
      this.container = null;

      // By default, the width and height of a `Game` instance will be as large as the inside of the browser window.
      this.width = root.innerWidth;
      this.height = root.innerHeight;
      this.color = new Color(255, 255, 255);

      this.assetLoader = new AssetLoader();

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
    }

    _inherits(Game, _Base);

    Game.prototype.addScene = function addScene() {
      // When adding a scene, the dimension of scenes should be
      // exactly as large as the `Game` instance itself
      this.queue.push(addable(Scene, this.children, function (child) {
        child.width = this.width;
        child.height = this.height;
      }).apply(this, arguments));
    };

    Game.prototype.showScene = function showScene(name) {
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
    };

    Game.prototype.preload = function preload(assets) {
      this.assetLoader.assets = assets;

      return this.assetLoader;
    };

    Game.prototype.run = function run(name) {
      var _this = this;

      this.on("executed", function () {
        // Start the game loop
        Loop.run();

        if (!name) {
          // If there's only no name, take the first scene
          if (_this.children.length >= 1) {
            name = _this.children.first().name;
          }
        }

        // Show the scene if a parameter has been specified
        _this.showScene(name);
      });
    };

    return Game;
  })(Base);

  serializable(Game);

  module.exports = Game;
});

define('flockn/gameobject', ["exports", "module", "flockn/base", "flockn/behavior", "flockn/graphics", "flockn/group", "flockn/model", "flockn/serialize", "flockn/texture", "flockn/types", "flockn/mixins"], function (exports, module, _flocknBase, _flocknBehavior, _flocknGraphics, _flocknGroup, _flocknModel, _flocknSerialize, _flocknTexture, _flocknTypes, _flocknMixins) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var Base = _interopRequire(_flocknBase);

  var Behavior = _interopRequire(_flocknBehavior);

  var Graphics = _interopRequire(_flocknGraphics);

  var Group = _interopRequire(_flocknGroup);

  var Model = _interopRequire(_flocknModel);

  var serialize = _interopRequire(_flocknSerialize);

  var Texture = _interopRequire(_flocknTexture);

  var Vector2 = _flocknTypes.Vector2;
  var Vector3 = _flocknTypes.Vector3;
  var Color = _flocknTypes.Color;
  var Rect = _flocknTypes.Rect;
  var addable = _flocknMixins.addable;
  var renderable = _flocknMixins.renderable;
  var updateable = _flocknMixins.updateable;
  var serializable = _flocknMixins.serializable;
  var storable = _flocknMixins.storable;

  var GameObject = (function (_Base) {
    function GameObject(descriptor) {
      var _this = this;

      _classCallCheck(this, GameObject);

      _Base.call(this, "GameObject", descriptor);

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

          _this.origin.x = _this.width / 2;
          _this.origin.y = _this.height / 2;
        }

        // TODO: Evaluate if the Graphics trigger should only be in the texture
        Graphics.trigger("texture-image-loaded", _this, _this.texture);
      });

      // Once the label is loaded, update width and height if `fitToTexture` is set
      this.texture.on("label-loaded", function () {
        if (_this.fitToTexture) {
          _this.width = _this.texture.label.width;
          _this.height = _this.texture.label.height;

          _this.origin.x = _this.width / 2;
          _this.origin.y = _this.height / 2;

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
    }

    _inherits(GameObject, _Base);

    GameObject.prototype.bounds = function bounds() {
      // TODO: Also take care of scale
      // TODO: Also take care of rotation
      return new Rect(this.position.x, this.position.y, this.width, this.height);
    };

    GameObject.prototype.addGameObject = function addGameObject() {
      // Add a game object to this game object
      this.queue.push(addable(GameObject, this.children).apply(this, arguments));
    };

    GameObject.prototype.addBehavior = function addBehavior() {
      // Add a `Behavior` instance to the the game object and update the `gameObject` property
      this.queue.push(addable(Behavior, this.children, function (child) {
        child.gameObject = this;
      }).apply(this, arguments));
    };

    GameObject.prototype.addModel = function addModel() {
      // Add a `Model` instance to the game object
      this.queue.push(addable(Model, this.children).apply(this, arguments));
    };

    GameObject.prototype.removeGameObject = function removeGameObject() {};

    GameObject.prototype.removeBehavior = function removeBehavior() {};

    GameObject.prototype.removeModel = function removeModel() {};

    GameObject.prototype.data = function data(name) {
      if (!name) {
        return this.models.byName("default");
      } else {
        return this.models.byName(name);
      }
    };

    GameObject.prototype.animate = function animate(property, end, time, callback) {
      // TODO: Tweening does not work yet
      if (typeof this[property] === "number") {
        var distance = end - this[property];
        var timeInS = time / 1000;

        var animateName = "animate-" + Date.now();
        this.on(animateName, function (dt) {

          this.off(animateName);
        });
      }
    };

    GameObject.fromString = function fromString() {};

    _createClass(GameObject, {
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
      }
    });

    return GameObject;
  })(Base);

  serializable(GameObject);
  storable(GameObject);

  module.exports = GameObject;
});

define('flockn/graphics', ["exports", "module", "eventmap"], function (exports, module, _eventmap) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var EventMap = _interopRequire(_eventmap);

  // `Graphics` is an instance of an `EventMap`
  var Graphics = new EventMap();

  // Special property `renderer` can be modified, but not deleted
  Object.defineProperty(Graphics, "renderer", {
    value: null,
    writable: true,
    enumerable: true
  });

  module.exports = Graphics;
});

define('flockn/graphics/rootelement', ["exports", "module"], function (exports, module) {
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
      rootElement.style.marginLeft = this.width * -0.5 + "px";
    }

    if (this.height < window.innerHeight) {
      rootElement.style.top = "50%";
      rootElement.style.marginTop = this.width * -0.5 + "px";
    }

    // Return the element, in case someone wants to meddle with it
    return rootElement;
  };

  module.exports = createRootElement;
});

define('flockn/group', ["exports", "module", "gamebox", "flockn/serialize"], function (exports, module, _gamebox, _flocknSerialize) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var Log = _gamebox.Log;

  var serialize = _interopRequire(_flocknSerialize);

  var unidentified = "untitled";
  var unidentifiedCounter = 0;

  var Group = (function () {
    function Group() {
      _classCallCheck(this, Group);

      this.length = 0;

      this.ids = {};
      this.tags = {};
      this.names = {};
      this.types = {};
    }

    Group.prototype.push = function push(obj) {
      var _this = this;

      var name = obj.name;
      var tags = obj.tags;
      var id = obj.id;

      name = name || unidentified + unidentifiedCounter++;
      id = id || unidentified + unidentifiedCounter++;
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
    };

    Group.prototype.pop = function pop() {
      var ids = Object.keys(this.ids);

      for (var i = ids.length, j = 0; j > i; i--) {
        var obj = this.ids[ids[i]];

        if (obj != null) {
          this.remove(i);
          return obj;
        }
      }
    };

    Group.prototype.values = function values() {
      var _this = this;

      return Object.keys(this.ids).filter(function (id) {
        return id != null;
      }).map(function (id) {
        return _this.ids[id];
      });
    };

    Group.prototype.all = function all(filter) {
      var objects = [];

      var recurse = (function (_recurse) {
        var _recurseWrapper = function recurse(_x) {
          return _recurse.apply(this, arguments);
        };

        _recurseWrapper.toString = function () {
          return _recurse.toString();
        };

        return _recurseWrapper;
      })(function (group) {
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
      });

      recurse(this);

      return objects;
    };

    Group.prototype.forEach = function forEach(callback) {
      this.values().forEach(function (obj) {
        return callback(obj);
      });
    };

    Group.prototype.map = function map(callback) {
      var mappedArray = new Group();

      this.forEach(function (obj) {
        return mappedArray.push(callback(obj));
      });

      return mappedArray;
    };

    Group.prototype.filter = function filter(callback) {
      var filteredArray = new Group();

      this.forEach(function (obj) {
        if (callback(obj)) {
          filteredArray.push(obj);
        }
      });

      return filteredArray;
    };

    Group.prototype.byType = function byType(type) {
      var _this = this;

      return this.types[type].map(function (index) {
        return _this[index];
      });
    };

    Group.prototype.byName = function byName(name) {
      var index = this.names[name];

      return this.ids[Object.keys(this.ids)[index]];
    };

    Group.prototype.byTag = function byTag(tag) {
      var _this = this;

      return this.tags[tag].map(function (index) {
        return _this[index];
      });
    };

    Group.prototype.first = function first() {
      return this.values()[0];
    };

    Group.prototype.last = function last() {
      var values = this.values();

      return values[values.length - 1];
    };

    Group.prototype.select = function select(selector) {};

    Group.prototype.toJSON = function toJSON() {
      return this.values().map(function (child) {
        if (child.toJSON && typeof child === "function") {
          return child.toJSON();
        } else {
          return child;
        }
      });
    };

    Group.prototype.toString = function toString() {
      return serialize.toString(this.toJSON());
    };

    Group.fromJSON = function fromJSON(arr) {
      var group = new Group();

      arr.forEach(function (obj) {
        return group.push(obj);
      });

      return group;
    };

    Group.fromString = function fromString(str) {
      return Group.fromJSON(JSON.parse(str));
    };

    Group.prototype.remove = function remove(index) {
      var _this = this;

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
            _this.tags[tag] = [];
          } else {
            _this.tags[tag].splice(position, 1);
          }
        }
      });

      this.length = all().length;
    };

    Group.prototype.removeByName = function removeByName(name) {
      var index = this.names[name];
      this.remove(index);
    };

    Group.prototype.removeByTag = function removeByTag(tags) {
      var _this = this;

      if (!Array.isArray(tags)) {
        tags = [tags];
      }

      tags.forEach(function (tag) {
        _this.tags[tag].forEach(function (index) {
          return _this.remove(index);
        });
        _this.tags = [];
      });
    };

    return Group;
  })();

  module.exports = Group;
});

// TODO: There needs to be a parser here

define('flockn', ["exports", "module", "flockn/game", "flockn/gameobject", "flockn/scene", "flockn/behavior"], function (exports, module, _flocknGame, _flocknGameobject, _flocknScene, _flocknBehavior) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var Game = _interopRequire(_flocknGame);

  var GameObject = _interopRequire(_flocknGameobject);

  var Scene = _interopRequire(_flocknScene);

  var Behavior = _interopRequire(_flocknBehavior);

  var flockn = function flockn(descriptor) {
    return new Game(descriptor);
  };

  flockn.gameObject = function (name, factory) {
    return GameObject.define(name, factory);
  };

  flockn.scene = function (name, factory) {
    return Scene.define(name, factory);
  };

  flockn.behavior = function (name, factory) {
    return Behavior.define(name, factory);
  };

  module.exports = flockn;
});

define('flockn/input/mouse', ["exports", "flockn/types/vector2"], function (exports, _flocknTypesVector2) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  // These are things that might be moved into freezedev/gameboard

  var Vector2 = _interopRequire(_flocknTypesVector2);

  var events = ["click", "mousedown", "mouseup", "mouseover"];

  var absolutePosition = function absolutePosition(event, rootElement) {
    return new Vector2(event.pageX - rootElement.offsetLeft, event.pageY - rootElement.offsetTop);
  };

  var relativePosition = function relativePosition(event, rootElement, offset) {
    // Normalize offset
    var offsetVector = Object.hasOwnProperty.call(offset, "x") && Object.hasOwnProperty.call(offset, "y") ? offset : new Vector2(offset.left, offset.top);

    return absolutePosition(event, rootElement).subtract(offsetVector);
  };

  exports.events = events;
  exports.absolutePosition = absolutePosition;
  exports.relativePosition = relativePosition;
});

define('flockn/mixins/addable', ["exports", "module", "flockn/graphics"], function (exports, module, _flocknGraphics) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var Graphics = _interopRequire(_flocknGraphics);

  var addable = function addable(Factory, groupInstance, extraFn) {

    var adder = function adder(child) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

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

  module.exports = addable;
});

define('flockn/mixins', ["exports", "flockn/mixins/addable", "flockn/mixins/renderable", "flockn/mixins/updateable", "flockn/mixins/serializable", "flockn/mixins/storable"], function (exports, _flocknMixinsAddable, _flocknMixinsRenderable, _flocknMixinsUpdateable, _flocknMixinsSerializable, _flocknMixinsStorable) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var addable = _interopRequire(_flocknMixinsAddable);

  var renderable = _interopRequire(_flocknMixinsRenderable);

  var updateable = _interopRequire(_flocknMixinsUpdateable);

  var serializable = _interopRequire(_flocknMixinsSerializable);

  var storable = _interopRequire(_flocknMixinsStorable);

  exports.addable = addable;
  exports.renderable = renderable;
  exports.updateable = updateable;
  exports.serializable = serializable;
  exports.storable = storable;
});

define('flockn/mixins/renderable', ["exports", "module", "flockn/utils/checkforflag", "flockn/graphics"], function (exports, module, _flocknUtilsCheckforflag, _flocknGraphics) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var checkForFlag = _interopRequire(_flocknUtilsCheckforflag);

  var Graphics = _interopRequire(_flocknGraphics);

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

  module.exports = renderable;
});

define('flockn/mixins/serializable', ["exports", "module", "flockn/serialize"], function (exports, module, _flocknSerialize) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var serialize = _interopRequire(_flocknSerialize);

  var serializable = function serializable(Factory) {
    Factory.prototype.toJSON = function () {
      return serialize.toJSON(this);
    };

    Factory.prototype.toString = function () {
      return serialize.toString(this);
    };
  };

  module.exports = serializable;
});

define('flockn/mixins/storable', ["exports", "module"], function (exports, module) {
  "use strict";

  var storable = function storable(Factory) {
    Factory.store = {};

    Factory.define = function (name, factory) {
      if (Factory[store][name]) {
        throw new Error("" + name + " does already exist.");
      } else {
        Factory[store][name] = factory;
      }
    };
  };

  module.exports = storable;
});

define('flockn/mixins/updateable', ["exports", "module", "flockn/utils/checkforflag"], function (exports, module, _flocknUtilsCheckforflag) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var checkForFlag = _interopRequire(_flocknUtilsCheckforflag);

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

  module.exports = updatable;
});

define('flockn/model', ["exports", "module", "eventmap", "flockn/mixins"], function (exports, module, _eventmap, _flocknMixins) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var EventMap = _interopRequire(_eventmap);

  var serializable = _flocknMixins.serializable;
  var storable = _flocknMixins.storable;

  var Model = (function (_EventMap) {
    function Model() {
      _classCallCheck(this, Model);

      _EventMap.call(this);

      // Store attribute data
      this.data = {};
    }

    _inherits(Model, _EventMap);

    Model.prototype.get = function get(name) {
      // Get an attribute if it exists
      if (Object.hasOwnProperty.call(this.data, name)) {
        return this.data[name];
      }
    };

    Model.prototype.set = function set(name, value) {
      // Set or add an attribute
      this.data[name] = value;
      // Trigger the `change` event with `name` and `value` as its parameters
      this.trigger("change", name, value);
    };

    Model.prototype.bind = function bind() {};

    Model.prototype.has = function has(name) {
      return Object.hasOwnProperty.call(this.data, name);
    };

    return Model;
  })(EventMap);

  serializable(Model);
  storable(Model);

  module.exports = Model;
});

define('flockn/plugins/collision', ["exports", "flockn/behavior"], function (exports, _flocknBehavior) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var Behavior = _interopRequire(_flocknBehavior);

  Behavior.define("collision", function () {

    this.update(function (dt) {});
  });
});

define('flockn/plugins/movement', ["exports", "flockn/behavior", "flockn/model", "gamebox"], function (exports, _flocknBehavior, _flocknModel, _gamebox) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var Behavior = _interopRequire(_flocknBehavior);

  var Model = _interopRequire(_flocknModel);

  var Input = _gamebox.Input;

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

define('flockn/plugins/spriteanimation', ["exports", "flockn/behavior"], function (exports, _flocknBehavior) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var Behavior = _interopRequire(_flocknBehavior);

  Behavior.define("sprite-animation", function () {});
});

define('flockn/renderer/canvas', ["exports", "flockn/types", "flockn/graphics", "flockn/graphics/rootelement", "flockn/input/mouse"], function (exports, _flocknTypes, _flocknGraphics, _flocknGraphicsRootelement, _flocknInputMouse) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var Vector2 = _flocknTypes.Vector2;

  var Graphics = _interopRequire(_flocknGraphics);

  var createRootElement = _interopRequire(_flocknGraphicsRootelement);

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

        if (obj.texture.backgroundColor.toString() !== "transparent") {
          context.fillStyle = obj.texture.backgroundColor.toString();
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

define('flockn/renderer/dom', ["exports", "flockn/graphics", "flockn/graphics/rootelement", "flockn/input/mouse"], function (exports, _flocknGraphics, _flocknGraphicsRootelement, _flocknInputMouse) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var Graphics = _interopRequire(_flocknGraphics);

  var createRootElement = _interopRequire(_flocknGraphicsRootelement);

  var mouse = _flocknInputMouse;

  var root = window;

  var pixelize = function pixelize(num) {
    return num + "px";
  };

  var unpixelize = function unpixelize(str) {
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
      if (parent && parent.isRoot || parent == null) {
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
            element.style.display = obj.visible ? "block" : "hidden";
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
          element.style.backgroundColor = obj.texture.backgroundColor.toString();

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
              element.style.backgroundPositionX = obj.texture.image.offset.x * -1 + "px";
            }

            if (obj.texture.image.offset.y !== 0) {
              element.style.backgroundPositionY = obj.texture.image.offset.y * -1 + "px";
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

define('flockn/scene', ["exports", "module", "flockn/base", "flockn/gameobject", "flockn/mixins"], function (exports, module, _flocknBase, _flocknGameobject, _flocknMixins) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var Base = _interopRequire(_flocknBase);

  var GameObject = _interopRequire(_flocknGameobject);

  var addable = _flocknMixins.addable;
  var renderable = _flocknMixins.renderable;
  var updateable = _flocknMixins.updateable;
  var serializable = _flocknMixins.serializable;
  var storable = _flocknMixins.storable;

  // A `Scene` instance is a layer for `GameObject` instances.
  // Any number of game objects can be added to a scene. Only one scene should be visible at the same time, depending
  // on what was set in the `activeScene` property of a `Game` instance.

  var Scene = (function (_Base) {
    function Scene(descriptor) {
      _classCallCheck(this, Scene);

      _Base.call(this, "Scene", descriptor);

      this.visible = true;

      // Mix in `renderable` and `updateable`
      renderable.call(this);
      updateable.call(this);
    }

    _inherits(Scene, _Base);

    Scene.prototype.addGameObject = function addGameObject() {
      // Allow game objects to be added to scenes
      this.queue.push(addable(GameObject, this.children).apply(this, arguments));
    };

    return Scene;
  })(Base);

  serializable(Scene);
  storable(Scene);

  module.exports = Scene;
});

define('flockn/selector', ["exports", "module"], function (exports, module) {
  "use strict";

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var Selector = (function () {
    function Selector(selectorString) {
      _classCallCheck(this, Selector);
    }

    Selector.prototype.parse = function parse() {};

    return Selector;
  })();

  module.exports = Selector;
});

define('flockn/serialize', ["exports", "module", "eventmap"], function (exports, module, _eventmap) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var EventMap = _interopRequire(_eventmap);

  var serialize = {};

  serialize.json = {};

  serialize.json.filter = ["id", "parent", "audio", "input", "world", "assetLoader"];
  serialize.json.defaultReplacer = [];

  serialize.json.defaultReplacer.push(function (key, value) {
    if (key === "events" && value instanceof EventMap) {
      value = value.serialize();
    }

    return value;
  });

  serialize.json.defaultReplacer.push(function (key, value) {
    // Convert image to Base64
    if (value instanceof Image) {
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      canvas.height = this.height;
      canvas.width = this.width;
      context.drawImage(this.data, 0, 0);
      var dataURL = canvas.toDataURL("image/png");
      canvas = null;

      value = {
        data: dataURL,
        type: "image/png"
      };
    }

    return value;
  });

  serialize.json.defaultReplacer.push(function (key, value) {
    if (value === null) {
      return value;
    }

    if (value.toJSON && typeof value.toJSON === "function") {
      value = value.toJSON();
    }

    return value;
  });

  serialize.json.defaultReplacer.push(function (key, value) {
    // Functions are not allowed expect for the descriptor
    if (typeof value !== "function") {
      return value;
    } else {
      if (key === "descriptor") {
        return value;
      }
    }
  });

  serialize.toJSON = function (obj, replacer) {
    var clonedObj = {};

    var replacers = [].concat.apply([], [serialize.json.defaultReplacer, replacer]);

    for (var key in obj) {
      (function (key, value) {
        if (!Object.hasOwnProperty.call(obj, key)) {
          return;
        }

        if (serialize.json.filter.indexOf(key) >= 0) {
          return;
        }

        for (var i = 0, j = replacers.length; i < j; i++) {
          (function (rep) {
            if (rep) {
              value = rep.call(obj, key, value);
            }
          })(replacers[i]);
        }

        if (typeof value !== "undefined") {
          clonedObj[key] = value;
        }
      })(key, obj[key]);
    }

    return clonedObj;
  };

  serialize.toString = function (obj) {
    return JSON.stringify(serialize.toJSON(obj), function (key, value) {
      // Functions that are still left should be stringified

      if (typeof value === "function") {
        value = value.toString();
      }

      return value;
    });
  };

  module.exports = serialize;
});

define('flockn/texture/image', ["exports", "module", "flockn/types", "flockn/mixins/serializable"], function (exports, module, _flocknTypes, _flocknMixinsSerializable) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var Color = _flocknTypes.Color;
  var Vector2 = _flocknTypes.Vector2;

  var serializable = _interopRequire(_flocknMixinsSerializable);

  var TextureImage = (function () {
    function TextureImage(texture) {
      _classCallCheck(this, TextureImage);

      // The default values for `image`
      this.color = Color.transparent();
      this.drawable = false;
      this.offset = new Vector2(0, 0);
      this.data = null;
      this.width = 0;
      this.height = 0;

      var filename = "";

      Object.defineProperty(this, "filename", {
        get: function get() {
          return filename;
        },
        set: function set(value) {
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
    }

    TextureImage.prototype.toJSON = function toJSON() {
      return serialize.toJSON(this);
    };

    TextureImage.prototype.toString = function toString() {
      return serialize.toString(this);
    };

    return TextureImage;
  })();

  serializable(TextureImage);

  module.exports = TextureImage;
});

define('flockn/texture', ["exports", "module", "flockn/types", "eventmap", "flockn/texture/image", "flockn/texture/label", "flockn/mixins/serializable"], function (exports, module, _flocknTypes, _eventmap, _flocknTextureImage, _flocknTextureLabel, _flocknMixinsSerializable) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var Color = _flocknTypes.Color;

  var EventMap = _interopRequire(_eventmap);

  var TextureImage = _interopRequire(_flocknTextureImage);

  var TextureLabel = _interopRequire(_flocknTextureLabel);

  var serializable = _interopRequire(_flocknMixinsSerializable);

  var Texture = (function (_EventMap) {
    function Texture() {
      var _this = this;

      _classCallCheck(this, Texture);

      _EventMap.call(this);

      // Set up dimensions
      this.width = 0;
      this.height = 0;

      // Set parent property
      this.parent = null;

      this.image = new TextureImage(this);
      this.label = new TextureLabel(this);

      this.backgroundColor = Color.transparent();

      // TODO: What to do when there is both an image and a label
      this.on("image-loaded", function () {
        _this.width = _this.image.width;
        _this.height = _this.image.height;
      });

      this.on("label-loaded", function () {
        _this.width = _this.label.width;
        _this.height = _this.label.height;
      });
    }

    _inherits(Texture, _EventMap);

    return Texture;
  })(EventMap);

  serializable(Texture);

  module.exports = Texture;
});

define('flockn/texture/label', ["exports", "module", "flockn/types", "flockn/mixins/serializable"], function (exports, module, _flocknTypes, _flocknMixinsSerializable) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var Color = _flocknTypes.Color;

  var serializable = _interopRequire(_flocknMixinsSerializable);

  var TextureLabel = function TextureLabel(texture) {
    _classCallCheck(this, TextureLabel);

    // Default value for `label`
    this.drawable = false;
    this.font = {
      size: 10,
      name: "Arial",
      color: Color.black(),
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
      get: function get() {
        return text;
      },
      set: function set(value) {
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

  serializable(TextureLabel);

  module.exports = TextureLabel;
});

define('flockn/types/color', ["exports", "module", "gamebox/math/clamp", "flockn/constants/color"], function (exports, module, _gameboxMathClamp, _flocknConstantsColor) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var clamp = _interopRequire(_gameboxMathClamp);

  var colorConstants = _interopRequire(_flocknConstantsColor);

  var Color = (function () {
    function Color() {
      var r = arguments[0] === undefined ? 0 : arguments[0];
      var g = arguments[1] === undefined ? 0 : arguments[1];
      var b = arguments[2] === undefined ? 0 : arguments[2];
      var a = arguments[3] === undefined ? 1 : arguments[3];

      _classCallCheck(this, Color);

      this.set(r, g, b, a);
    }

    Color.prototype.set = function set() {
      var r = arguments[0] === undefined ? 0 : arguments[0];
      var g = arguments[1] === undefined ? 0 : arguments[1];
      var b = arguments[2] === undefined ? 0 : arguments[2];
      var a = arguments[3] === undefined ? 1 : arguments[3];

      this.r = r;
      this.g = g;
      this.b = b;
      this.a = a;
    };

    Color.prototype.lighten = function lighten(factor) {
      factor = clamp(factor, 0, 1);

      this.r = clamp(this.r + factor * 255 | 0, 0, 255);
      this.g = clamp(this.g + factor * 255 | 0, 0, 255);
      this.b = clamp(this.b + factor * 255 | 0, 0, 255);
    };

    Color.prototype.darken = function darken(factor) {
      factor = clamp(factor, 0, 1);

      this.r = clamp(this.r - factor * 255 | 0, 0, 255);
      this.g = clamp(this.g - factor * 255 | 0, 0, 255);
      this.b = clamp(this.b - factor * 255 | 0, 0, 255);
    };

    Color.prototype.fadeIn = function fadeIn(factor) {
      factor = clamp(factor, 0, 1);

      this.a = this.a + this.a * factor;
      if (this.a > 1) {
        this.a = 1;
      }
    };

    Color.prototype.fadeOut = function fadeOut(factor) {
      factor = clamp(factor, 0, 1);

      this.a = this.a - this.a * factor;
      if (this.a < 0) {
        this.a = 0;
      }
    };

    Color.prototype.toJSON = function toJSON() {
      if (this.a < 1) {
        if (this.a === 0) {
          return "transparent";
        } else {
          return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
        }
      } else {
        return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
      }
    };

    Color.prototype.toString = function toString() {
      return this.toJSON();
    };

    Color.prototype.toHex = function toHex() {
      return "#" + this.r.toString(16) + "" + this.g.toString(16) + "" + this.b.toString(16);
    };

    // Getting a random color for debugging is quite useful sometimes

    Color.random = function random() {
      var col = [0, 0, 0];

      col = col.map(function () {
        return ~ ~(Math.random() * 255);
      });

      return new Color(col[0], col[1], col[2]);
    };

    return Color;
  })();

  for (var colorName in colorConstants) {
    var colorValue = colorConstants[colorName];

    (function (colorName, colorValue) {
      Color[colorName] = function () {
        var col = new Color(colorValue.r, colorValue.g, colorValue.b, colorValue.a);
        col.name = colorName;
        return col;
      };
    })(colorName, colorValue);
  }

  module.exports = Color;
});

define('flockn/types', ["exports", "flockn/types/color", "flockn/types/vector2", "flockn/types/vector3", "flockn/types/rect"], function (exports, _flocknTypesColor, _flocknTypesVector2, _flocknTypesVector3, _flocknTypesRect) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var Color = _interopRequire(_flocknTypesColor);

  var Vector2 = _interopRequire(_flocknTypesVector2);

  var Vector3 = _interopRequire(_flocknTypesVector3);

  var Rect = _interopRequire(_flocknTypesRect);

  var Types = {};

  Types.Color = Color;
  Types.Vector2 = Vector2;
  Types.Vector3 = Vector3;
  Types.Rect = Rect;

  exports["default"] = Types;
  exports.Color = Color;
  exports.Vector2 = Vector2;
  exports.Vector3 = Vector3;
  exports.Rect = Rect;
});

define('flockn/types/rect', ["exports", "module", "flockn/types/vector2"], function (exports, module, _flocknTypesVector2) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var Vector2 = _interopRequire(_flocknTypesVector2);

  var Rect = (function () {
    function Rect() {
      var x = arguments[0] === undefined ? 0 : arguments[0];
      var y = arguments[1] === undefined ? 0 : arguments[1];
      var w = arguments[2] === undefined ? 0 : arguments[2];
      var h = arguments[3] === undefined ? 0 : arguments[3];

      _classCallCheck(this, Rect);

      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
    }

    Rect.prototype.clone = function clone() {
      return new Rect({ x: this.x, y: this.y, w: this.w, h: this.h });
    };

    Rect.prototype.toJSON = function toJSON() {
      return { x: this.x, y: this.y, w: this.w, h: this.h };
    };

    Rect.prototype.toString = function toString() {
      return JSON.stringify(this.toJSON());
    };

    Rect.fromString = function fromString(str) {
      var obj = JSON.parse(str);

      return new Rect(obj.x, obj.y, obj.w, obj.h);
    };

    Rect.prototype.center = function center() {
      return new Vector2(this.x + this.w / 2, this.y + this.h / 2);
    };

    Rect.prototype.contains = function contains(vector) {
      return vector.x >= this.x && vector.y >= this.y && vector.x < this.x + this.w && vector.y < this.y + this.h;
    };

    return Rect;
  })();

  module.exports = Rect;
});

define('flockn/types/vector2', ["exports", "module"], function (exports, module) {
  "use strict";

  var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var sqrMagnitude = function sqrMagnitude(v) {
    return Vector2.dot(v, v);
  };

  var Vector2 = (function () {
    function Vector2() {
      var x = arguments[0] === undefined ? 0 : arguments[0];
      var y = arguments[1] === undefined ? 0 : arguments[1];

      _classCallCheck(this, Vector2);

      this.set(x, y);
    }

    Vector2.prototype.set = function set() {
      var x = arguments[0] === undefined ? 0 : arguments[0];
      var y = arguments[1] === undefined ? 0 : arguments[1];

      this.x = x;
      this.y = y;
    };

    Vector2.dot = function dot(vec1, vec2) {
      return vec1.x * vec2.x + vec1.y * vec2.y;
    };

    Vector2.fromAngle = function fromAngle(angle, magnitude) {
      return new Vector2(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
    };

    Vector2.prototype.toJSON = function toJSON() {
      return this.clone();
    };

    Vector2.prototype.toString = function toString() {
      return JSON.stringify(this.toJSON());
    };

    Vector2.fromJSON = function fromJSON(obj) {
      return new Vector2(obj.x, obj.y);
    };

    Vector2.fromString = function fromString(str) {
      return Vector2.fromJSON(JSON.parse(str));
    };

    Vector2.prototype.clone = function clone() {
      return new Vector2(this.x, this.y);
    };

    Vector2.prototype.add = function add(vector) {
      this.x += vector.x;
      this.y += vector.y;

      return this;
    };

    Vector2.prototype.subtract = function subtract(vector) {
      this.x -= vector.x;
      this.y -= vector.y;

      return this;
    };

    Vector2.prototype.multiply = function multiply(vector) {
      this.x *= vector.x;
      this.y *= vector.y;

      return this;
    };

    Vector2.prototype.divide = function divide(vector) {
      this.x /= vector.x;
      this.y /= vector.y;

      return this;
    };

    Vector2.prototype.normalize = function normalize() {
      this.x = this.x / this.magnitude;
      this.y = this.y / this.magnitude;

      return this;
    };

    Vector2.prototype.equals = function equals(v) {
      return this.x === v.x && this.y === v.y;
    };

    _createClass(Vector2, {
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
      }
    });

    return Vector2;
  })();

  module.exports = Vector2;
});

define('flockn/types/vector3', ["exports", "module"], function (exports, module) {
  "use strict";

  var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var sqrMagnitude = function sqrMagnitude(v) {
    return Vector3.dot(v, v);
  };

  var Vector3 = (function () {
    function Vector3() {
      var x = arguments[0] === undefined ? 0 : arguments[0];
      var y = arguments[1] === undefined ? 0 : arguments[1];
      var z = arguments[2] === undefined ? 0 : arguments[2];

      _classCallCheck(this, Vector3);

      this.set(x, y, z);
    }

    Vector3.prototype.set = function set() {
      var x = arguments[0] === undefined ? 0 : arguments[0];
      var y = arguments[1] === undefined ? 0 : arguments[1];
      var z = arguments[2] === undefined ? 0 : arguments[2];

      this.x = x;
      this.y = y;
      this.z = z;
    };

    Vector3.dot = function dot(vec1, vec2) {
      return vec1.x * vec2.x + vec1.y * vec2.y + vec1.z * vec2.z;
    };

    Vector3.cross = function cross(vec1, vec2) {
      return new Vector3(vec1.y * vec2.z - vec2.y * vec1.z, vec1.z * vec2.x - vec2.z * vec1.x, vec1.x * vec2.y - vec2.x * vec1.y);
    };

    Vector3.prototype.clone = function clone() {
      return new Vector3(this.x, this.y, this.z);
    };

    Vector3.prototype.toJSON = function toJSON() {
      return this.clone();
    };

    Vector3.prototype.toString = function toString() {
      return JSON.stringify(this.toJSON());
    };

    Vector3.fromJSON = function fromJSON(obj) {
      return new Vector3(obj.x, obj.y, obj.z);
    };

    Vector3.fromString = function fromString(str) {
      return Vector3.fromJSON(JSON.parse(str));
    };

    Vector3.prototype.add = function add(vector) {
      this.x += vector.x;
      this.y += vector.y;
      this.z += vector.z;

      return this;
    };

    Vector3.prototype.subtract = function subtract(vector) {
      this.x -= vector.x;
      this.y -= vector.y;
      this.z -= vector.z;

      return this;
    };

    Vector3.prototype.multiply = function multiply(vector) {
      this.x *= vector.x;
      this.y *= vector.y;
      this.z *= vector.z;

      return this;
    };

    Vector3.prototype.divide = function divide(vector) {
      this.x /= vector.x;
      this.y /= vector.y;
      this.z /= vector.z;

      return this;
    };

    Vector3.prototype.normalize = function normalize() {
      this.x = this.x / this.magnitude;
      this.y = this.y / this.magnitude;
      this.z = this.z / this.magnitude;

      return this;
    };

    Vector3.prototype.equals = function equals(v) {
      return this.x === v.x && this.y === v.y && this.z === v.z;
    };

    Vector3.forward = function forward() {
      return new Vector3(0, 0, 1);
    };

    Vector3.right = function right() {
      return new Vector3(1, 0, 0);
    };

    Vector3.one = function one() {
      return new Vector3(1, 1, 1);
    };

    Vector3.up = function up() {
      return new Vector3(0, 1, 0);
    };

    Vector3.zero = function zero() {
      return new Vector3(0, 0, 0);
    };

    _createClass(Vector3, {
      magnitude: {
        get: function () {
          return Math.sqrt(sqrMagnitude(this));
        }
      },
      sqrMagnitude: {
        get: function () {
          return sqrMagnitude(this);
        }
      }
    });

    return Vector3;
  })();

  module.exports = Vector3;
});

define('flockn/utils/checkforflag', ["exports", "module"], function (exports, module) {
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

  module.exports = checkForFlag;
});

define('flockn/viewport', ["exports", "module"], function (exports, module) {
  "use strict";

  var Viewport = {};

  Viewport.scale = {};
  Viewport.scale.mode = "scaleToFit";
  Viewport.scale.x = 1;
  Viewport.scale.y = 1;

  Viewport.width = 800;
  Viewport.height = 600;

  module.exports = Viewport;
});

define('flockn/world', ["exports", "module", "flockn/model"], function (exports, module, _flocknModel) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var Model = _interopRequire(_flocknModel);

  // `World` is an instance of a model
  var world = new Model();

  module.exports = world;
});

//# sourceMappingURL=flockn.all.js.map