define(['./graphics'], function(Graphics) {
	return function() {
		var self = this;
		
		this.on('render', function() {
    	Graphics.trigger('render', self.type, self);
    	
      self.children.forEach(function(child) {
        child.trigger('render');
      });
    });
	};
});
