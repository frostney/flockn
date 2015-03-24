"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var EventMap = _interopRequire(require("eventmap"));

var _flocknMixins = require("flockn/mixins");

var serializable = _flocknMixins.serializable;
var storable = _flocknMixins.storable;
var Model = (function (EventMap) {
  function Model() {
    _classCallCheck(this, Model);

    EventMap.call(this);

    // Store attribute data
    this.data = {};
  }

  _inherits(Model, EventMap);

  Model.prototype.get = function get(name) {
    // Get an attribute if it exists
    if (Object.hasOwnProperty.call(this.data, name)) {
      return this.data[name];
    }
  };

  Model.prototype.set = function set(name, value) {
    // Set or add an attribute
    this.data[name] = value;
    // Trigger the `change` event with `name` and `value` as its parameters
    this.trigger("change", name, value);
  };

  Model.prototype.bind = function bind() {};

  Model.prototype.has = function has(name) {
    return Object.hasOwnProperty.call(this.data, name);
  };

  return Model;
})(EventMap);

serializable(Model);
storable(Model);

module.exports = Model;
//# sourceMappingURL=model.js.map