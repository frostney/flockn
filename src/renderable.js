udefine(['./graphics'], function(Graphics) {
  'use strict';

  return function() {
    var self = this;

    this.on('render', function() {
      // Emit `render` event on the `Graphics` object
      Graphics.trigger('render', self);

      // Render all children elements
      self.children.forEach(function(child) {
        child.trigger('render');
      });
    });
  };
});
