import EventMap from 'eventmap';

var serialize = {};

serialize.json = {};

serialize.json.filter = ['id', 'parent', 'audio', 'input', 'world', 'assetLoader'];
serialize.json.defaultReplacer = [];

serialize.json.defaultReplacer.push(function(key, value) {
  if (key === 'events' && value instanceof EventMap) {
    value = value.serialize();
  }

  return value;
});

serialize.json.defaultReplacer.push(function(key, value) {
  // Convert image to Base64
  if (value instanceof Image) {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    canvas.height = this.height;
    canvas.width = this.width;
    context.drawImage(this.data, 0, 0);
    let dataURL = canvas.toDataURL('image/png');
    canvas = null;

    value = {
      data: dataURL,
      type: 'image/png'
    };
  }

  return value;
});

serialize.json.defaultReplacer.push(function(key, value) {
  if (value === null) {
    return value;
  }

  if (value.toJSON && typeof value.toJSON === 'function') {
    value = value.toJSON();
  }

  return value;
});

serialize.json.defaultReplacer.push(function(key, value) {
  // Functions are not allowed expect for the descriptor
  if (typeof value !== 'function') {
    return value;
  } else {
    if (key === 'descriptor') {
      return value;
    }
  }
});

serialize.toJSON = function(obj, replacer) {
  var clonedObj = {};

  var replacers = [].concat.apply([], [serialize.json.defaultReplacer, replacer]);
  

  for (var key in obj) {
    (function(key, value) {
      if (!Object.hasOwnProperty.call(obj, key)) {
        return;
      }

      if (serialize.json.filter.indexOf(key) >= 0) {
        return;
      }

      for (var i = 0, j = replacers.length; i < j; i++) {
        (function(rep) {
          if (rep) {
            value = rep.call(obj, key, value);
          }
        })(replacers[i]);
      }

      if (typeof value !== 'undefined') {
        clonedObj[key] = value;
      }
    })(key, obj[key]);
  }

  return clonedObj;
};

serialize.toString = function(obj) {
  return JSON.stringify(serialize.toJSON(obj), function(key, value) {
    // Functions that are still left should be stringified

    if (typeof value === 'function') {
      value = value.toString();
    }

    return value;
  });
};

export default serialize;
