// Serialize function to `JSON.stringify` with a custom replacer
var serialize = function serialize(obj) {
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

export default serialize;
