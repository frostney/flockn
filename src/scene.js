udefine(['mixedice', './addable', './base', './group', './gameobject', './renderable', './updateable'], function(mixedice, addable, Base, Group, GameObject, renderable, updateable) {
  
  var Scene = function() {
    Base.extend([this, Scene.prototype], 'Scene').factory.call(this, arguments);
    
    renderable.call(this);
    updateable.call(this);
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
