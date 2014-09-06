udefine(['mixedice', './addable', './base', './constructable', './group', './gameobject'], function(mixedice, addable, Base, constructable, Group, GameObject) {
  
  var Scene = function() {
    mixedice([this, Scene.prototype], constructable(Base, 'Scene', arguments));
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
