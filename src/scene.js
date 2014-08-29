udefine(['mixedice', 'eventmap', './addable', './group', './gameobject'], function(mixedice, EventMap, addable, Group, GameObject) {
  
  var Scene = function() {
    mixedice([this, Scene.prototype], new EventMap());
  };
  
  Scene.prototype.addGameObject = function() {
    
  };
  
  Scene.store = {};
  
  Scene.define = function(name, factory) {
    Scene.store[name] = factory;
  };
  
});
