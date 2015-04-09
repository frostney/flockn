import Base from 'flockn/base';
import Group from 'flockn/group';

import {addable, updateable, serializable} from 'flockn/mixins';


// Behaviors only provide logic. There is no rendering involved.
// Behaviors can attach any number of behaviors to itself
class Behavior extends Base {
  constructor(descriptor) {
    super('Behavior', descriptor);

    // Reference to the game object itself
    this.gameObject = null;

    // Mix in `updateable`
    updateable.call(this);
  }

  addBehavior() {
    // When a behavior is added, the reference to the game object is set
    this.queue.push(addable(Behavior, this.children, function(child) {
      child.gameObject = this.gameObject;
    }).apply(this, arguments));
  }

  removeBehavior() {

  }
}

serializable(Behavior);

export default Behavior;
