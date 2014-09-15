udefine(['mixedice', './addable', './base', './behavior', './group', './renderable', './updateable'], function(mixedice, addable, Base, Behavior, Group, renderable, updateable) {
  var GameObject = function(descriptor) {
    Base.extend([this, GameObject.prototype], 'GameObject', descriptor);
    
    var self = this;
    
    this.x = 0;
    this.y = 0;
    
    // Behaviors
    this.behaviors = new Group();
    
    // Data models
    this.models = new Group();
    
    renderable.call(this);
    updateable.call(this);
    
    this.on('update', function() {
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
    this.queue.push(addable(GameObject, this.children).apply(this, arguments));
  };
  
  GameObject.prototype.addBehavior = function() {
    this.queue.push(addable(Behavior, this.behaviors).apply(this, arguments));
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
