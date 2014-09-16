udefine(['mixedice', './addable', './base', './behavior', './group', './renderable', './serialize', './updateable'], function(mixedice, addable, Base, Behavior, Group, renderable, serialize, updateable) {
  var GameObject = function(descriptor) {
    Base.extend([this, GameObject.prototype], 'GameObject', descriptor);
    
    var self = this;
    
    this.x = 0;
    this.y = 0;
    
    this.texture = new Texture();
    this.texture.on('loaded', function() {
    	self.width = this.texture.data.width;
    	self.height = this.texture.data.height;
    });
    
    this.width = 0;
    this.height = 0;
    
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
  	return serialize(this);
  };
  
  GameObject.prototype.fromJSON = function() {
  	
  };
  
  return GameObject;
});
