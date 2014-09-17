udefine(['mixedice', './addable', './base', './group', './updateable'], function(mixedice, addable, Base, Group, updateable) {
	'use strict';

  var Behavior = function(descriptor) {
    Base.extend([this, Behavior.prototype], 'Behavior', descriptor);
    
    this.gameObject = null;
    
    updateable.call(this);
  };

  Behavior.prototype.addBehavior = function() {
    this.queue.push(addable(Behavior, this.children).apply(this, arguments));
  };


  Behavior.store = {};

  Behavior.define = function(name, factory) {
    Behavior.store[name] = factory;
  };

  return Behavior;
}); 