udefine(['mixedice', './addable', './base', './behavior', './graphics', './group', './model', './renderable', './serialize', './texture', './updateable'], function(mixedice, addable, Base, Behavior, Graphics, Group, Model, renderable, serialize, Texture, updateable) {
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
