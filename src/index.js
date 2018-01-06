import Game from './game';

import GameObject from './gameobject';
import Scene from './scene';
import Behavior from './behavior';

// import Renderer from './renderer';

const flockn = function flockn(descriptor) {
  return new Game(descriptor);
};

// TODO: Comtemplate if this should be a property
/* flockn.setRenderer = function setRenderer(name) {
  Renderer.use(name);
}; */

flockn.Scene = Scene;
flockn.GameObject = GameObject;
flockn.Behavior = Behavior;

export default flockn;