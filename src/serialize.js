import EventMap from 'eventmap';

const serialize = {};

serialize.json = {};

serialize.json.filter = ['id', 'parent', 'audio', 'input', 'world', 'assetLoader'];
serialize.json.defaultReplacer = [];

serialize.json.defaultReplacer.push((key, value) => {
  if (key === 'events' && value instanceof EventMap) {
    return value.serialize();
  }

  return value;
});

serialize.json.defaultReplacer.push((key, value) => {
  // Convert image to Base64
  if (value instanceof Image) {
    let canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = this.height;
    canvas.width = this.width;
    context.drawImage(this.data, 0, 0);
    const dataURL = canvas.toDataURL('image/png');
    canvas = null;

    return {
      data: dataURL,
      type: 'image/png',
    };
  }

  return value;
});

serialize.json.defaultReplacer.push((key, value) => {
  if (value === null) {
    return value;
  }

  if (value.toJSON && typeof value.toJSON === 'function') {
    return value.toJSON();
  }

  return value;
});

serialize.json.defaultReplacer.push((key, value) => {
  // Functions are not allowed expect for the descriptor
  if (typeof value !== 'function') {
    return value;
  }

  if (key === 'descriptor') {
    return value;
  }

  return value;
});

serialize.toJSON = (obj, replacer) => {
  const clonedObj = {};

  const replacers = [].concat.apply([], [serialize.json.defaultReplacer, replacer]);

  Object.keys(obj).forEach((key) => {
    let value = obj[key];

    if (!Object.hasOwnProperty.call(obj, key)) {
      return;
    }

    if (serialize.json.filter.indexOf(key) >= 0) {
      return;
    }

    replacers.filter(rep => !!rep).forEach((rep) => {
      value = rep.call(obj, key, value);
    });

    if (typeof value !== 'undefined') {
      clonedObj[key] = value;
    }
  });

  return clonedObj;
};

serialize.toString = obj =>
  JSON.stringify(serialize.toJSON(obj), (key, value) => {
    // Functions that are still left should be stringified

    if (typeof value === 'function') {
      return value.toString();
    }

    return value;
  });

export default serialize;
