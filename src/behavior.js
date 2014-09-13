udefine(['mixedice', './addable', './base',  './group'], function(mixedice, addable, Base, Group) {

  var Behavior = function() {
    var self = this;
    
    Base.extend([this, Behavior.prototype], 'Behavior').factory.call(this, arguments);
    
    this.on('update', function(dt) {
      self.children.forEach(function(child) {
        child.trigger('update', dt);
      });
    });
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