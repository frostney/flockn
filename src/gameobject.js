udefine(['mixedice', './addable', './base', './behavior', './graphics', './group', './model', './renderable', './serialize', './texture', './updateable'], function(mixedice, addable, Base, Behavior, Graphics, Group, Model, renderable, serialize, Texture, updateable) {
  'use strict';

  var GameObject = function(descriptor) {
    Base.extend([this, GameObject.prototype], 'GameObject', descriptor);

    var self = this;

    this.visible = true;

    this.x = 0;
    this.y = 0;
    
    // TODO: Those should be shorthands to update x and y
    this.left = 0;
    this.right = 0;
    this.top = 0;
    this.bottom = 0;

    this.fitToTexture = true;

    this.texture = new Texture();
    this.texture.parent = this;
    this.texture.on('loaded', function() {
      if (self.fitToTexture) {
        self.width = self.texture.data.width;
        self.height = self.texture.data.height;
        
        // TODO: Update this.origin as well
      }

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
    
    this.origin = {
    	x: (width / 2),
    	y: (width / 2)
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

  GameObject.prototype.addModel = function() {
    this.queue.push(addable(Model, this.models).apply(this, arguments));
  };

  GameObject.prototype.toJSON = function() {
    return serialize(this);
  };

  GameObject.prototype.fromJSON = function() {

  };

  return GameObject;
});
