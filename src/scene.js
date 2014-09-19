udefine(['mixedice', './addable', './base', './group', './gameobject', './renderable', './updateable'], function(mixedice, addable, Base, Group, GameObject, renderable, updateable) {
  'use strict';

  // A `Scene` instance is a layer for `GameObject` instances.
  // Any number of game objects can be added to a scene. Only one scene should be visible at the same time, depending
  // on what was set in the `activeScene` property of a `Game` instance.
  var Scene = function(descriptor) {
    Base.extend([this, Scene.prototype], 'Scene', descriptor);

    // Mix in `renderable` and `updateable`
    renderable.call(this);
    updateable.call(this);
  };

  Scene.prototype.addGameObject = function() {
    // Allow game objects to be added to scenes
    this.queue.push(addable(GameObject, this.children).apply(this, arguments));
  };

  Scene.store = {};

  // Scenes can be defined and are stored on the object itself
  Scene.define = function(name, factory) {
    Scene.store[name] = factory;
  };

  return Scene;

});
