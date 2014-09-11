udefine(['mixedice', './addable', './base', './constructable', './scene'], function(mixedice, addable, Base, constructable, Scene) {
  var Game = function() {
    mixedice([this, Game.prototype], constructable(Base, 'Game', arguments));
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
