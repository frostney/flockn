udefine(['./graphics'], function(Graphics) {
  'use strict';

  return function(Factory, groupInstance, extraFn) {

    var adder = function() {
      var child = arguments[0];
      var args = 2 <= arguments.length ? [].slice.call(arguments, 1) : [];

      if (!( child instanceof Factory)) {
        if ( typeof child === 'string') {
          if (Object.hasOwnProperty.call(Factory.store, child)) {
            child = new Factory(Factory.store[child]);
          }
        } else {
          if ( typeof child === 'function') {
            child = new Factory(child);
          } else {
            // TODO: This should be also able to deep assign properties
            child = new Factory(function() {
              Object.keys(child).forEach(function(key) {
                this[key] = child[key];
              }, this);
            });
          }
        }
      }
      groupInstance.push(child);
      child.parent = this;

      if (extraFn) {
        extraFn.call(this, child);
      }

      Graphics.trigger('add', child);

      child.apply(args);
      child.trigger('add', child, args);
    };

    return function() {
      var args = [].slice.call(arguments);
      args.unshift(this);

      return adder.bind.apply(adder, args);
    };

  };
});
