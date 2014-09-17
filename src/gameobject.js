udefine(['mixedice', './addable', './base', './behavior', './graphics', './group', './renderable', './serialize', './texture', './updateable'], function(mixedice, addable, Base, Behavior, Graphics, Group, renderable, serialize, Texture, updateable) {
  var GameObject = function(descriptor) {
    Base.extend([this, GameObject.prototype], 'GameObject', descriptor);
    
    var self = this;
    
    this.visible = true;
    
    this.x = 0;
    this.y = 0;
    
    this.texture = new Texture();
    this.texture.parent = this;
    this.texture.on('loaded', function() {
    	self.width = self.texture.data.width;
    	self.height = self.texture.data.height;
    	
    	// TODO: Evaluate if the Graphics trigger should only in the texture
    	Graphics.trigger('texture-loaded', self, self.texture);
    });
    
    this.width = 0;
    this.height = 0;
    
    this.angle = 0;
    
    this.alpha = 1;
    
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
