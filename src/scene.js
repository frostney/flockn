udefine(['mixedice', './addable', './base', './group', './gameobject', './renderable', './updateable'], function(mixedice, addable, Base, Group, GameObject, renderable, updateable) {
  'use strict';

  var Scene = function(descriptor) {
    Base.extend([this, Scene.prototype], 'Scene', descriptor);

    renderable.call(this);
    updateable.call(this);
  };

  Scene.prototype.addGameObject = function() {
    this.queue.push(addable(GameObject, this.children).apply(this, arguments));
  };

  Scene.store = {};

  Scene.define = function(name, factory) {
    Scene.store[name] = factory;
  };

  return Scene;

});
