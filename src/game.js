udefine(['mixedice', './base'], function(mixedice, Base) {
  var Game = function() {
    mixedice([this, Game.prototype], new Base('Game'));
  };
  
  Game.prototype.add = function(name) {
    
  };
  
  Game.prototype.show = function(name) {
    
  };
  
  return Game;
});
