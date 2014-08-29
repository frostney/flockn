udefine(['eventmap', 'mixedice', './group'], function(EventMap, mixedice, Group) {
  
  var Base = function() {
    mixedice([this, Base.prototype], new EventMap());
    
    var type = arguments[0];
    var descriptor = arguments[1];
    
    this.type = type;
    this.name = this.type + '-' + Date.now();
    
    this.children = new Group();
    
    this.parent = null;
    
    this.trigger('create');
  };
  
  return Base;
  
});
