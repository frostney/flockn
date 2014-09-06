udefine(['mixedice', './addable', './base', './group', './gameobject'], function(mixedice, addable, Base, Group, GameObject) {
  
  var Scene = function() {
    mixedice([this, Scene.prototype], new Base('Scene'));
  };
  
  Scene.prototype.addGameObject = function() {
    addable(GameObject, this.children).apply(this, arguments);
  };
  
  Scene.store = {};
  
  Scene.define = function(name, factory) {
    Scene.store[name] = factory;
  };
  
  return Scene;
  
});
