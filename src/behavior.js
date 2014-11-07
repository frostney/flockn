import addable from 'flockn/addable';
import Base from 'flockn/base';
import Group from 'flockn/group';
import updateable from 'flockn/updateable';


// Behaviors only provide logic. There is no rendering involved.
// Behaviors can attach any number of behaviors to itself
class Behavior {
  constructor(descriptor) {
    Base.extend([this, Behavior.prototype], 'Behavior', descriptor);

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

  static define(name, factory) {
    Behavior.store[name] = factory;
  }
}

// Behaviors can be defined and are stored on the object itself
Behavior.store = {};

export default Behavior;
