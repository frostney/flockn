import EventMap from 'eventmap';

// Serialize function to `JSON.stringify` with a custom replacer
var serialize = function serialize(obj) {
  // Shift parent reference
  // TODO: This is a bit a hacky I understand, but it works for now. Once the object is passed into
  //  JSON.stringify, we ran into a call stack error
  var parentRef = null;

  if (Object.hasOwnProperty.call(obj, 'parent')) {
    parentRef = obj.parent;
    obj.parent = null;
  }

  var string = JSON.stringify(obj, function(key, value) {
    // Avoiding cyclic dependencies
    if (key === 'parent') {
      return;
    }

    if (key === 'events' && obj instanceof EventMap) {
      value = obj.serialize();
    }

    // Use custom toString function if available
    if (typeof value === 'object' && value != null && Object.hasOwnProperty.call(value, 'toString')) {
      value = value.toString();
    }

    // Convert image to Base64
    if (value instanceof Image) {
      let canvas = document.createElement('canvas');
      let context = canvas.getContext('2d');
      canvas.height = this.height;
      canvas.width = this.width;
      context.drawImage(this.data, 0, 0);
      let dataURL = canvas.toDataURL('image/png');
      canvas = null;

      value = dataURL;
    }

    // Stringify the descriptor
    if (key === 'descriptor') {
      value = value.toString();
    }

    return value;
  });

  // Put the parent reference back in
  if (Object.hasOwnProperty.call(obj, 'parent')) {
    obj.parent = parentRef
  }

  return string;
};

export default serialize;
