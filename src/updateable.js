define(function() {
	return function() {
		var self = this;
		
		this.on('update', function(dt) {
      self.children.forEach(function(child) {
        child.trigger('update', dt);
      });
    });
	};
});
