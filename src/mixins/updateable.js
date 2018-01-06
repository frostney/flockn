import checkForFlag from '../utils/checkforflag';

const isStatic = checkForFlag('static');

// TODO: This is not completely how I want it be as it only sets the children as static and not the element itself
// TODO: Evaluate if it's a good idea if static elements shouldn't be able to interact with - similar to PIXI's
//  interactive property
const updatable = function updateable() {
  // Update all children
  this.on('update', (dt) => {
    if (!isStatic.call(this)) {
      return;
    }

    this.children.forEach((child) => {
      if (child.update) {
        child.trigger('update', dt);
      }
    });
  });
};

export default updatable;
