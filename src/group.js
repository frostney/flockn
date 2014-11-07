import serialize from 'flockn/serialize';

var unidentified = 'untitled';
var unidentifiedCounter = 0;

class Group {
  constructor() {
    this.length = 0;

    this.tags = {};
    this.names = {};
    this.types = {};
  }

  push(obj, tags) {
    var name = obj.name || (unidentified + unidentifiedCounter++);
    if (tags == null) {
      tags = obj.tags || [];
    }

    if (Object.hasOwnProperty.call(this.names, name)) {
      return;
    }

    this[this.length] = obj;

    Object.keys(this.tags).forEach(function(tag) {
      this.tags[tag] = this.tags[tag] || [];
      this.tags[tag].push(this.length);
    }, this);

    this.names[name] = this.length;

    if (obj.type != null) {
      this.types[obj.type] = this.types[obj.type] || [];
      this.types[obj.type].push(this.length);
    }

    return ++this.length;
  }

  // TODO: Behavior currently stays in the list
  pop() {
    return this[this.length];
  }

  splice(index, how) {

  }

  slice(begin, end) {
    if (end == null) {
      end = this.length;
    }

    var slicedGroup = new Group();

    for (var i = begin; i < end; i++) {
      slicedGroup.push(this[i]);
    }

    return slicedGroup;
  }

  forEach(callback) {
    for (var i = 0; i < this.length; i++) {
      callback(this[i]);
    }
  }

  map(callback) {
    var mappedArray = new Group();

    for (var i = 0; i < this.length; i++) {
      mappedArray.push(callback(this[i]));
    }

    return mappedArray;
  }

  filter(callback) {
    var filteredArray = new Group();

    for (var i = 0; i < this.length; i++) {
      if (callback(this[i])) {
        filteredArray.push(this[i]);
      }
    }

    return filteredArray;
  }

  byType(type) {
    return this.types[type].map(function(index) {
      return this[index];
    }, this);
  }

  byName(name) {
    return this[this.names[name]];
  }

  byTag(tag) {
    return this.tags[tag].map(function(index) {
      return this[index];
    }, this);
  }

  select(selector) {

  }

  toJSON() {
    return serialize(this);
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }

  remove(index) {
    var name = this[index].name;
    var tags = this[index].tags;

    delete this.names[name];


    delete this[index];

    /*for (var i = index, i < this.length; i++) {
     this[]
     }*/

    this.length--;
  }

  removeByName(name) {

  }

  removeByTag(tag) {
    if (!Array.isArray(tags)) {
      tags = [tags];
    }
  }
}

export default Group;
