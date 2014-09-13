udefine(['mixedice', './addable', './base', './behavior', './graphics', './group'], function(mixedice, addable, Base, Behavior, Graphics, Group) {
  var GameObject = function() {
    Base.extend([this, GameObject.prototype], 'GameObject').factory.call(this, arguments);
    
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
  
  GameObject.prototype.toJSON = function() {
  	var obj = {};
  	
  	for (var key in this) {
  		if (Object.hasOwnProperty.call(this, key)) {
  			var value = this[key];
  			
  			if (typeof value !== 'function') {
  				if (value.toJSON && typeof value.toJSON === 'function') {
  					obj[key] = value.toJSON();
  				} else {
  					obj[key] = value;
  				}
  			}
  		}
  	}
  	
  	return obj;
  };
  
  GameObject.prototype.fromJSON = function() {
  	
  };
  
  return GameObject;
});
