udefine(function() {
  'use strict';

  return function() {
    var self = this;

    // Update all children
    this.on('update', function(dt) {
      self.children.forEach(function(child) {
        child.trigger('update', dt);
      });
    });
  };
});
