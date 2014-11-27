import Base from 'flockn/base';
import GameObject from 'flockn/gameobject';

import {addable, renderable, updateable} from 'flockn/mixins';

// A `Scene` instance is a layer for `GameObject` instances.
// Any number of game objects can be added to a scene. Only one scene should be visible at the same time, depending
// on what was set in the `activeScene` property of a `Game` instance.
class Scene extends Base {
  constructor(descriptor) {
    super('Scene', descriptor);

    this.visible = true;

    // Mix in `renderable` and `updateable`
    renderable.call(this);
    updateable.call(this);
  }

  addGameObject() {
    // Allow game objects to be added to scenes
    this.queue.push(addable(GameObject, this.children).apply(this, arguments));
  }

  // Scenes can be defined and are stored on the object itself
  static define(name, factory) {
    Scene.store[name] = factory;
  }
}

export default Scene;
