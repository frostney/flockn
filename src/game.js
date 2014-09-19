udefine(['root', 'mixedice', 'gameboard/loop', './addable', './base', './graphics', './scene', './renderable', './updateable'], function(root, mixedice, Loop, addable, Base, Graphics, Scene, renderable, updateable) {
  'use strict';

  var Game = function(descriptor) {
    if (!this || !this instanceof Game) {
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
    
    this.activeScene = null;

    // Game is the root element so the descriptor needs to be called directly
    // because it won't be added to anywhere else
    this.call();

    // Mix in renderable and updateable
    renderable.call(this);
    updateable.call(this);

    // Bind the game loop to the update event
    Loop.on('update', function(dt) {
      // Deltatime should not be a millisecond value, but a second one
      // It should be a value between 0 - 1
      self.trigger('update', dt / 1000);
    });

    // Bind the game loop to the render event
    Loop.on('render', function() {
      self.trigger('render');
    });

    // Add a resize event to the Game class
    root.addEventListener('resize', function() {
      self.trigger('resize');
    }, false);

    // Add an orientationchange event to the Game class
    root.addEventListener('orientationchange', function() {
      self.trigger('orientationchange');
    }, false);
  };

  Game.prototype.addScene = function() {
    // When adding a scene, the dimension of scenes should be
    // exactly as large as the Game itself
    this.queue.push(addable(Scene, this.children, function(child) {
      child.width = this.width;
      child.height = this.height;
    }).apply(this, arguments));
  };

  Game.prototype.showScene = function(name) {
    // TODO: Add transitions
    
    // Set the activeScene property
    this.activeScene = name;
    
    // Trigger the show event
    this.trigger('show', this.activeScene, this.children[this.activeScene]);
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
