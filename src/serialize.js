import EventMap from 'eventmap';

var serialize = {};

serialize.json = {};

serialize.json.filter = ['id', 'parent'];
serialize.json.defaultReplacer = [];

serialize.json.defaultReplacer.push(function(key, value) {
  if (key === 'events' && obj instanceof EventMap) {
    value = obj.serialize();
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
  // Stringify the descriptor
  if (key === 'descriptor') {
    value = value.toString();
  }

  return value;
});

serialize.json.defaultReplacer.push(function(key, value) {
  if (Object.hasOwnProperty(value, 'toJSON')) {
    value = value.toJSON();
  }

  return value;
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
  return JSON.stringify(serialize.toJSON(obj));
};

export default serialize;
