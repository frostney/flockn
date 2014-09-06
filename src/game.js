udefine(['mixedice', './addable', './base', './scene'], function(mixedice, addable, Base, Scene) {
  var Game = function() {
    mixedice([this, Game.prototype], new Base('Game'));
  };
  
  Game.prototype.addScene = function(name) {
    addable(Scene, this.children).apply(this, arguments);
  };
  
  Game.prototype.showScene = function(name) {
    this.activeScene = name;
  };
  
  return Game;
});
