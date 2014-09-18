udefine(['root', 'mixedice', 'gameboard/loop', './addable', './base', './graphics', './scene', './renderable', './updateable'], function(root, mixedice, Loop, addable, Base, Graphics, Scene, renderable, updateable) {
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
  	
  	if (!name) {
  		// If there's only one scene, specifying a name is not necessary
  		if (this.children.length === 1) {
  			name = this.children[0].name;
  		}
  	}
  	
  	if (name) {
  		this.showScene(name);  		
  	}
  };
  
  return Game;
});
