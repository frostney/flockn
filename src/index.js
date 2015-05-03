import Game from './game';

import GameObject from './gameobject';
import Scene from './scene';
import Behavior from './behavior';

import Renderer from './renderer';

var flockn = function flockn(descriptor) {
  return new Game(descriptor);
};

// TODO: Comtemplate if this should be a property
flockn.setRenderer = function(name) {
  Renderer.use(name);
};

export default flockn;
