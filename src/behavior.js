udefine(['mixedice', './addable', './base', './constructable',  './group'], function(mixedice, addable, Base, constructable, Group) {

  var Behavior = function() {
    var self = this;
    
    mixedice([this, Behavior.prototype], constructable(Base, 'Behavior', arguments));
    
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