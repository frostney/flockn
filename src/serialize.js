udefine(function() {
  'use strict';

  // Serialize function to `JSON.stringify` with a custom replacer
  return function(obj) {
    return JSON.stringify(obj, function(key, value) {
      // Avoiding cyclic dependencies
      if (key === 'parent') {
        return;
      }

      // Stringify the descriptor
      if (key === 'descriptor') {
        value = value.toString();
      }

      return value;
    });
  };
});
