udefine(['eventmap', 'mixedice', './group'], function(EventMap, mixedice, Group) {
  
  var Base = function() {
    mixedice([this, Base.prototype], new EventMap());
    
    var type = arguments[0];
    var descriptor = arguments[1];
    var args = 3 <= arguments.length ? [].slice.call(arguments, 2) : [];
    
    this.type = type;
    this.name = this.type + '-' + Date.now();
    
    this.children = new Group();
    
    this.parent = null;
    
    if (descriptor) {
    	descriptor.apply(this, args);
    }
    
    this.trigger('create');
  };
  
  return Base;
  
});
