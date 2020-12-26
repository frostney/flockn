import Base from './Base';

import { addable, updateable, serializable } from './mixins';

// Behaviors only provide logic. There is no rendering involved.
// Behaviors can attach any number of behaviors to itself
class Behavior extends Base {
  constructor(descriptor) {
    super(descriptor);

    // Reference to the game object itself
    this.gameObject = null;

    // Mix in `updateable`
    updateable.call(this);
  }

  addBehavior(...args) {
    // When a behavior is added, the reference to the game object is set
    this.queue.push(
      addable(Behavior, this.children, (child) => {
        /* eslint no-param-reassign: 0 */

        child.gameObject = this.gameObject;
      }).apply(this, args)
    );
  }
}

serializable(Behavior);

export default Behavior;
