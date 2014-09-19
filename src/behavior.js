udefine(['mixedice', './addable', './base', './group', './updateable'], function(mixedice, addable, Base, Group, updateable) {
  'use strict';

  // Behaviors only provide logic. There is no rendering involved.
  // Behaviors can attach any number of behaviors to itself
  var Behavior = function(descriptor) {
    Base.extend([this, Behavior.prototype], 'Behavior', descriptor);

    // Reference to the game object itself
    this.gameObject = null;

    // Mix in `updateable`
    updateable.call(this);
  };

  Behavior.prototype.addBehavior = function() {
    // When a behavior is added, the reference to the game object is set
    this.queue.push(addable(Behavior, this.children, function(child) {
      child.gameObject = this.gameObject;
    }).apply(this, arguments));
  };

  // Behaviors can be defined and are stored on the object itself
  Behavior.store = {};

  Behavior.define = function(name, factory) {
    Behavior.store[name] = factory;
  };

  return Behavior;
});
