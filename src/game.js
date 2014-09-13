udefine(['mixedice', './addable', './base', './scene', './renderable', './updateable'], function(mixedice, addable, Base, Scene, renderable, updateable) {
  var Game = function(descriptor) {
  	Base.extend([this, Game.prototype], 'Game', descriptor);
  	
  	this.call();
  	
  	renderable.call(this);
  	updateable.call(this);
  };
  
  Game.prototype.addScene = function(name) {
    addable(Scene, this.children).apply(this, arguments);
  };
  
  Game.prototype.showScene = function(name) {
    this.activeScene = name;
    this.trigger('show', this.activeScene, this.children[this.activeScene]);
  };
  
  Game.prototype.run = function(name) {
  	
  	if (name) {
  		this.showScene(name);
  	}
  };
  
  return Game;
});
