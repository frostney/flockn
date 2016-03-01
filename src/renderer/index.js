import DOMRenderer from './dom';
import CanvasRenderer from './canvas';

let renderers = {};

let Renderer = {};

Renderer.register = function(name, descriptor) {
  renderers[name] = descriptor;
};

Renderer.use = function(name) {
  if (Object.hasOwnProperty.call(renderers, name)) {
    renderers[name] && renderers[name]();
  }
};

Renderer.register('dom', DOMRenderer);
Renderer.register('canvas', CanvasRenderer);

export default Renderer;
