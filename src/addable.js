udefine(function() {
  return function(Factory, groupInstance) {

    return function() {
      var child = arguments[0];
      var args = 2 <= arguments.length ? [].slice.call(arguments, 1) : [];

      if (!( child instanceof Factory)) {
        if ( typeof child === 'string') {
          if (Object.hasOwnProperty.call(store, child)) {
            child = new Factory(Factory.store[child], args);
          }
        } else {
          child = new Factory(child, args);
        }
      }
      groupInstance.push(child);
      child.parent = this;
      child.trigger('add', child, args);
    };
  };
});
