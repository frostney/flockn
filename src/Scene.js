import Base from './Base';
import GameObject from './GameObject';

import { addable, renderable, updateable, serializable } from './mixins';

// A `Scene` instance is a layer for `GameObject` instances.
// Any number of game objects can be added to a scene.
// Only one scene should be visible at the same time, depending
// on what was set in the `activeScene` property of a `Game` instance.
class Scene extends Base {
  constructor(descriptor) {
    super(descriptor);

    this.visible = true;

    // Mix in `renderable` and `updateable`
    renderable.call(this);
    updateable.call(this);
  }

  addGameObject(...args) {
    // Allow game objects to be added to scenes
    this.queue.push(addable(GameObject, this.children).apply(this, args));
  }
}

serializable(Scene);

export default Scene;
