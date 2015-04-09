'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Vector2 = require('flockn/types/vector2');

var _Vector22 = _interopRequireWildcard(_Vector2);

var Rect = (function () {
  function Rect() {
    var x = arguments[0] === undefined ? 0 : arguments[0];
    var y = arguments[1] === undefined ? 0 : arguments[1];
    var w = arguments[2] === undefined ? 0 : arguments[2];
    var h = arguments[3] === undefined ? 0 : arguments[3];

    _classCallCheck(this, Rect);

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  Rect.prototype.clone = function clone() {
    return new Rect({ x: this.x, y: this.y, w: this.w, h: this.h });
  };

  Rect.prototype.toJSON = function toJSON() {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  };

  Rect.prototype.toString = function toString() {
    return JSON.stringify(this.toJSON());
  };

  Rect.fromString = function fromString(str) {
    var obj = JSON.parse(str);

    return new Rect(obj.x, obj.y, obj.w, obj.h);
  };

  Rect.prototype.center = function center() {
    return new _Vector22['default'](this.x + this.w / 2, this.y + this.h / 2);
  };

  Rect.prototype.contains = function contains(vector) {
    return vector.x >= this.x && vector.y >= this.y && vector.x < this.x + this.w && vector.y < this.y + this.h;
  };

  return Rect;
})();

exports['default'] = Rect;
module.exports = exports['default'];
//# sourceMappingURL=rect.js.map