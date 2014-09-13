udefine(['mixedice', './addable', './base', './scene'], function(mixedice, addable, Base, Scene) {
  var Game = function() {
  	Base.extend([this, Game.prototype], 'Game').factory.call(this, arguments);
  };
  
  Game.prototype.addScene = function(name) {
    addable(Scene, this.children).apply(this, arguments);
  };
  
  Game.prototype.showScene = function(name) {
    this.activeScene = name;
    this.trigger('show', this.activeScene, this.children[this.activeScene]);
  };
  
  return Game;
});
