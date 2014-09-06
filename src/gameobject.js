udefine(['mixedice', './addable', './base', './behavior', './constructable', './graphics', './group'], function(mixedice, addable, Base, Behavior, constructable, Graphics, Group) {
  var GameObject = function() {
    mixedice([this, GameObject.prototype], constructable(Base, 'GameObject', arguments));
    
    var self = this;
    
    this.x = 0;
    this.y = 0;
    
    this.parent = null;
    
    // Behaviors
    this.behaviors = new Group();
    
    // Data models
    this.models = new Group();
    
    this.on('render', function() {
    	Graphics.trigger('render', self.type, self);
    	
      self.children.forEach(function(child) {
        child.trigger('render');
      });
    });
    
    this.on('update', function() {
      self.children.forEach(function(child) {
        child.trigger('update');
      });
      
      self.behaviors.forEach(function(behavior) {
        behavior.trigger('update');
      });
    });
  };
  
  GameObject.store = {};
  
  GameObject.define = function(name, factory) {
    GameObject.store[name] = factory;
  };
  
  GameObject.prototype.addGameObject = function() {
    addable(GameObject, this.children).apply(this, arguments);
  };
  
  GameObject.prototype.addBehavior = function() {
    addable(Behavior, this.behaviors).apply(this, arguments);
  };
  
  return GameObject;
});
