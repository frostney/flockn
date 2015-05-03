import Game from './game';

import GameObject from './gameobject';
import Scene from './scene';
import Behavior from './behavior';

var flockn = function flockn(descriptor) {
  return new Game(descriptor);
};

};

export default flockn;
