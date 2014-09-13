udefine(['mixedice', './addable', './base', './group', './updateable'], function(mixedice, addable, Base, Group, updateable) {

  var Behavior = function() {
    Base.extend([this, Behavior.prototype], 'Behavior').factory.call(this, arguments);
    
    updateable.call(this);
  };

  Behavior.prototype.addBehavior = function() {
    addable(Behavior, this.children).apply(this, arguments);
  };


  Behavior.store = {};

  Behavior.define = function(name, factory) {
    Behavior.store[name] = factory;
  };

  return Behavior;
}); 