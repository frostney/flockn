import Game from './game';

import GameObject from './gameobject';
import Scene from './scene';
import Behavior from './behavior';

var flockn = function flockn(descriptor) {
  return new Game(descriptor);
};

flockn.gameObject = function(name, factory) {
  return GameObject.define(name, factory);
};

flockn.scene = function(name, factory) {
  return Scene.define(name, factory);
};

flockn.behavior = function(name, factory) {
  return Behavior.define(name, factory);
};

export default flockn;
