import {Color, Vector2, Vector3, Rect} from 'flockn/types';

// Serialize function to `JSON.stringify` with a custom replacer
var serialize = function serialize(obj) {
  return JSON.stringify(obj, function(key, value) {
    // Avoiding cyclic dependencies
    if (key === 'parent') {
      return;
    }

    if (value instanceof Color) {
      value = value.toString();
    }

    if (value instanceof Vector2) {
      value = value.toString();
    }

    if (value instanceof Vector3) {
      value = value.toString();
    }

    if (value instanceof Rect) {
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
};

export default serialize;
