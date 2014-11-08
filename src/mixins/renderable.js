import Graphics from 'flockn/graphics';

var renderable = function renderable() {
  this.on('render', () => {
    // Emit `render` event on the `Graphics` object
    Graphics.trigger('render', this);

    // Render all children elements
    this.children.forEach(function(child) {
      child.trigger('render');
    });
  });
};

export default renderable;
