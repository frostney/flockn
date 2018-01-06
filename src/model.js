import EventMap from 'eventmap';
import { serializable } from './mixins';

class Model extends EventMap {
  constructor() {
    super();

    // Store attribute data
    this.data = {};
  }

  get(name) {
    // Get an attribute if it exists
    if (Object.hasOwnProperty.call(this.data, name)) {
      return this.data[name];
    }
  }

  set(name, value) {
    // Set or add an attribute
    this.data[name] = value;
    // Trigger the `change` event with `name` and `value` as its parameters
    this.trigger('change', name, value);
  }

  bind() {

  }

  has(name) {
    return Object.hasOwnProperty.call(this.data, name);
  }
}

serializable(Model);

export default Model;
