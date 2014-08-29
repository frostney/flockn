udefine(['eventmap', 'mixedice', './addable', './group'], function(addable, Group) {

  var Behavior = function() {
    var descriptor = arguments[0];
    var args = 2 <= arguments.length ? [].slice.call(arguments, 1) : [];
    var self = this;
    
    mixedice([this, Behavior.prototype], new EventMap());
    
    
    this.type = 'Behavior';
    this.name = this.type + "-" + (Date.now());
    this.tags = [];
    this.children = new Group();
    
    this.parent = null;
    descriptor.apply(this, args);
    
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