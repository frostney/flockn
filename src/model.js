udefine(['mixedice', 'eventmap'], function(mixedice, EventMap) {
  'use strict';

  var Model = function() {
    // Mix in `EventMap` into all `Model` instances
    mixedice([this, Model.prototype], new EventMap());
    
    // Store attribute data
    this.data = {};
  };

  Model.prototype.get = function(name) {
    // Get an attribute if it exists
    if (Object.hasOwnProperty.call(this.data, name)) {
      return this.data[name];
    }
  };

  Model.prototype.set = function(name, value) {
    // Set or add an attribute
    this.data[name] = value;
    // Trigger the `change` event with `name` and `value` as its parameters
    this.trigger('change', name, value);
  };

  return Model;

});
