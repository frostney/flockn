udefine(['mixedice', './addable', './base', './group', './gameobject'], function(mixedice, addable, Base, Group, GameObject) {
  
  var Scene = function() {
    Base.extend([this, Scene.prototype], 'Scene').factory.call(this, arguments);
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
