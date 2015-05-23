'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _eventmap = require('eventmap');

var _eventmap2 = _interopRequireDefault(_eventmap);

var _mixins = require('./mixins');

var Model = (function (_EventMap) {
  function Model() {
    _classCallCheck(this, Model);

    _EventMap.call(this);

    // Store attribute data
    this.data = {};
  }

  _inherits(Model, _EventMap);

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
    this.trigger('change', name, value);
  };

  Model.prototype.bind = function bind() {};

  Model.prototype.has = function has(name) {
    return Object.hasOwnProperty.call(this.data, name);
  };

  return Model;
})(_eventmap2['default']);

_mixins.serializable(Model);

exports['default'] = Model;
module.exports = exports['default'];
//# sourceMappingURL=model.js.map