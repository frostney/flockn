import { Log } from 'gamebox';
import serialize from './serialize';

const unidentified = 'untitled';
let unidentifiedCounter = 0;

class Group {
  constructor() {
    this.length = 0;

    this.ids = {};
    this.tags = {};
    this.names = {};
    this.types = {};
  }

  push(obj) {
    let { name, id } = obj;

    name = name || unidentified + (unidentifiedCounter += 1);
    id = id || unidentified + (unidentifiedCounter += 1);

    if (this.ids[id] != null || this.names[name] != null) {
      Log.w(`An object with the name ${name} or id ${id} already exists`);
      return this.length;
    }

    const currentLength = Object.keys(this.ids);
    this.ids[id] = obj;

    Object.keys(this.tags).forEach((tag) => {
      this.tags[tag] = this.tags[tag] || [];
      this.tags[tag].push(currentLength);
    });

    this.names[name] = this.length;

    if (obj.type != null) {
      this.types[obj.type] = this.types[obj.type] || [];
      this.types[obj.type].push(currentLength);
    }

    this.length = this.values().length;

    return this.length;
  }

  pop() {
    const ids = Object.keys(this.ids);

    for (let i = ids.length, j = 0; j > i; i -= 1) {
      const obj = this.ids[ids[i]];

      if (obj != null) {
        this.remove(i);
        return obj;
      }
    }

    return null;
  }

  values() {
    return Object.keys(this.ids)
      .filter((id) => id != null)
      .map((id) => this.ids[id]);
  }

  all(filter) {
    const objects = [];

    const recurse = (group) => {
      group.forEach((obj) => {
        if (filter) {
          if (filter(obj)) {
            objects.push(obj);
          }
        } else {
          objects.push(obj);
        }

        if (obj.children && obj.children instanceof Group) {
          recurse(obj.children);
        }
      });
    };

    recurse(this);

    return objects;
  }

  forEach(callback) {
    this.values().forEach((obj) => callback(obj));
  }

  map(callback) {
    const mappedArray = new Group();

    this.forEach((obj) => mappedArray.push(callback(obj)));

    return mappedArray;
  }

  filter(callback) {
    const filteredArray = new Group();

    this.forEach((obj) => {
      if (callback(obj)) {
        filteredArray.push(obj);
      }
    });

    return filteredArray;
  }

  byType(type) {
    return this.types[type].map((index) => this[index]);
  }

  byName(name) {
    const index = this.names[name];

    return this.ids[Object.keys(this.ids)[index]];
  }

  byTag(tag) {
    return this.tags[tag].map((index) => this[index]);
  }

  first() {
    return this.values()[0];
  }

  last() {
    const values = this.values();

    return values[values.length - 1];
  }

  toJSON() {
    return this.values().map((child) => {
      if (child.toJSON && typeof child === 'function') {
        return child.toJSON();
      }

      return child;
    });
  }

  toString() {
    return serialize.toString(this.toJSON());
  }

  static fromJSON(arr) {
    const group = new Group();

    arr.forEach((obj) => group.push(obj));

    return group;
  }

  static fromString(str) {
    return Group.fromJSON(JSON.parse(str));
  }

  remove(index) {
    const id = Object.keys(this.ids)[index];

    const obj = this.ids[id];

    if (obj == null) {
      Log.w(`Object at ${index} does not exist`);
    }

    const { name } = obj;

    this.ids[id] = null;
    this.names[name] = null;

    this.tags.forEach((tag) => {
      const position = tag.indexOf(index);

      if (position >= 0) {
        if (tag.length === 1) {
          this.tags[tag] = [];
        } else {
          this.tags[tag].splice(position, 1);
        }
      }
    });

    this.length = this.all().length;
  }

  removeByName(name) {
    const index = this.names[name];
    this.remove(index);
  }

  removeByTag(initialTags) {
    let tags;

    if (!Array.isArray(initialTags)) {
      tags = [initialTags];
    }

    tags.forEach((tag) => {
      this.tags[tag].forEach((index) => this.remove(index));
      this.tags = [];
    });
  }
}

export default Group;
