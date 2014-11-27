import checkForFlag from 'flockn/utils/ckeckforflag';

var isStatic = checkForFlag('static');

// TODO: This is not completely how I want it be as it only sets the children as static and not the element itself
var updatable = function updateable() {
  // Update all children
  this.on('update', dt => {
    if (!isStatic.call(this)) {
      return;
    }

    this.children.forEach(child => {
      if (child.update) {
        child.trigger('update', dt);
      }
    });
  });
};

export default updatable;
