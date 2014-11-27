import Graphics from 'flockn/graphics';

var isVisible = function isVisible() {
  var hasVisibleFlag = Object.hasOwnProperty.call(this, 'visible');
  return hasVisibleFlag && this.visible;
};

var renderable = function renderable() {
  this.on('render', () => {
    // Only render if element is visible
    if (!isVisible()) {
      return;
    }

    // Emit `render` event on the `Graphics` object
    Graphics.trigger('render', this);

    // Render all children elements
    this.children.forEach(child => child.trigger('render'));
  });
};

export default renderable;
