var updatable = function() {
  var self = this;

  // Update all children
  this.on('update', dt => {
    self.children.forEach(child => {
      if (child.update) {
        child.trigger('update', dt);
      }
    });
  });
};

export default updatable;
