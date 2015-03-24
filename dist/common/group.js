"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Log = require("gamebox").Log;
var serialize = _interopRequire(require("flockn/serialize"));

var unidentified = "untitled";
var unidentifiedCounter = 0;

var Group = (function () {
  function Group() {
    _classCallCheck(this, Group);

    this.length = 0;

    this.ids = {};
    this.tags = {};
    this.names = {};
    this.types = {};
  }

  Group.prototype.push = function push(obj) {
    var _this = this;
    var name = obj.name;
    var tags = obj.tags;
    var id = obj.id;


    name = name || unidentified + unidentifiedCounter++;
    id = id || unidentified + unidentifiedCounter++;
    tags = tags || [];

    if (this.ids[id] != null || this.names[name] != null) {
      Log.w("An object with the name " + name + " or id " + id + " already exists");
      return;
    }

    var currentLength = Object.keys(this.ids);
    this.ids[id] = obj;

    Object.keys(this.tags).forEach(function (tag) {
      _this.tags[tag] = _this.tags[tag] || [];
      _this.tags[tag].push(currentLength);
    });

    this.names[name] = this.length;

    if (obj.type != null) {
      this.types[obj.type] = this.types[obj.type] || [];
      this.types[obj.type].push(currentLength);
    }

    this.length = this.values().length;
    return this.length;
  };

  Group.prototype.pop = function pop() {
    var ids = Object.keys(this.ids);

    for (var i = ids.length, j = 0; j > i; i--) {
      var obj = this.ids[ids[i]];

      if (obj != null) {
        this.remove(i);
        return obj;
      }
    }
  };

  Group.prototype.values = function values() {
    var _this = this;
    return Object.keys(this.ids).filter(function (id) {
      return id != null;
    }).map(function (id) {
      return _this.ids[id];
    });
  };

  Group.prototype.all = function all(filter) {
    var objects = [];

    var recurse = function (group) {
      group.forEach(function (obj) {
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
  };

  Group.prototype.forEach = function forEach(callback) {
    this.values().forEach(function (obj) {
      return callback(obj);
    });
  };

  Group.prototype.map = function map(callback) {
    var mappedArray = new Group();

    this.forEach(function (obj) {
      return mappedArray.push(callback(obj));
    });

    return mappedArray;
  };

  Group.prototype.filter = function filter(callback) {
    var filteredArray = new Group();

    this.forEach(function (obj) {
      if (callback(obj)) {
        filteredArray.push(obj);
      }
    });

    return filteredArray;
  };

  Group.prototype.byType = function byType(type) {
    var _this = this;
    return this.types[type].map(function (index) {
      return _this[index];
    });
  };

  Group.prototype.byName = function byName(name) {
    var index = this.names[name];

    return this.ids[Object.keys(this.ids)[index]];
  };

  Group.prototype.byTag = function byTag(tag) {
    var _this = this;
    return this.tags[tag].map(function (index) {
      return _this[index];
    });
  };

  Group.prototype.first = function first() {
    return this.values()[0];
  };

  Group.prototype.last = function last() {
    var values = this.values();

    return values[values.length - 1];
  };

  Group.prototype.select = function select(selector) {};

  Group.prototype.toJSON = function toJSON() {
    return this.values().map(function (child) {
      if (child.toJSON && typeof child === "function") {
        return child.toJSON();
      } else {
        return child;
      }
    });
  };

  Group.prototype.toString = function toString() {
    return serialize.toString(this.toJSON());
  };

  Group.fromJSON = function fromJSON(arr) {
    var group = new Group();

    arr.forEach(function (obj) {
      return group.push(obj);
    });

    return group;
  };

  Group.fromString = function fromString(str) {
    return Group.fromJSON(JSON.parse(str));
  };

  Group.prototype.remove = function remove(index) {
    var _this = this;
    var id = Object.keys(ids)[index];

    var obj = this.ids[id];

    if (obj == null) {
      Log.w("Object at " + index + " does not exist");
    }

    var name = obj.name;
    var tags = obj.tags;


    this.ids[id] = null;
    this.names[name] = null;

    this.tags.forEach(function (tag) {
      var position = tag.indexOf(index);

      if (position >= 0) {
        if (tag.length === 1) {
          _this.tags[tag] = [];
        } else {
          _this.tags[tag].splice(position, 1);
        }
      }
    });

    this.length = all().length;
  };

  Group.prototype.removeByName = function removeByName(name) {
    var index = this.names[name];
    this.remove(index);
  };

  Group.prototype.removeByTag = function removeByTag(tags) {
    var _this = this;
    if (!Array.isArray(tags)) {
      tags = [tags];
    }

    tags.forEach(function (tag) {
      _this.tags[tag].forEach(function (index) {
        return _this.remove(index);
      });
      _this.tags = [];
    });
  };

  return Group;
})();

module.exports = Group;
// TODO: There needs to be a parser here
//# sourceMappingURL=group.js.map