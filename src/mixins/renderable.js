import checkForFlag from '../utils/checkforflag';
import Graphics from '../graphics';

const isVisible = checkForFlag('visible');

const renderable = function renderable() {
  this.on('render', () => {
    // Only render if element is visible
    if (!isVisible.call(this)) {
      return;
    }

    // Emit `render` event on the `Graphics` object
    Graphics.trigger('render', this);

    // Render all children elements
    this.children.forEach(child => child.trigger('render'));
  });
};

export default renderable;
