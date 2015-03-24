"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var sqrMagnitude = function (v) {
  return Vector2.dot(v, v);
};

var Vector2 = (function () {
  function Vector2() {
    var x = arguments[0] === undefined ? 0 : arguments[0];
    var y = arguments[1] === undefined ? 0 : arguments[1];
    _classCallCheck(this, Vector2);

    this.set(x, y);
  }

  Vector2.prototype.set = function set() {
    var x = arguments[0] === undefined ? 0 : arguments[0];
    var y = arguments[1] === undefined ? 0 : arguments[1];
    this.x = x;
    this.y = y;
  };

  Vector2.dot = function dot(vec1, vec2) {
    return vec1.x * vec2.x + vec1.y * vec2.y;
  };

  Vector2.fromAngle = function fromAngle(angle, magnitude) {
    return new Vector2(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
  };

  Vector2.prototype.toJSON = function toJSON() {
    return this.clone();
  };

  Vector2.prototype.toString = function toString() {
    return JSON.stringify(this.toJSON());
  };

  Vector2.fromJSON = function fromJSON(obj) {
    return new Vector2(obj.x, obj.y);
  };

  Vector2.fromString = function fromString(str) {
    return Vector2.fromJSON(JSON.parse(str));
  };

  Vector2.prototype.clone = function clone() {
    return new Vector2(this.x, this.y);
  };

  Vector2.prototype.add = function add(vector) {
    this.x += vector.x;
    this.y += vector.y;

    return this;
  };

  Vector2.prototype.subtract = function subtract(vector) {
    this.x -= vector.x;
    this.y -= vector.y;

    return this;
  };

  Vector2.prototype.multiply = function multiply(vector) {
    this.x *= vector.x;
    this.y *= vector.y;

    return this;
  };

  Vector2.prototype.divide = function divide(vector) {
    this.x /= vector.x;
    this.y /= vector.y;

    return this;
  };

  Vector2.prototype.normalize = function normalize() {
    this.x = this.x / this.magnitude;
    this.y = this.y / this.magnitude;

    return this;
  };

  Vector2.prototype.equals = function equals(v) {
    return this.x === v.x && this.y === v.y;
  };

  _prototypeProperties(Vector2, null, {
    magnitude: {
      get: function () {
        return Math.sqrt(sqrMagnitude(this));
      },
      configurable: true
    },
    sqrMagnitude: {
      get: function () {
        return sqrMagnitude(this);
      },
      configurable: true
    },
    angle: {
      get: function () {
        return Math.atan2(this.x, this.y);
      },
      configurable: true
    }
  });

  return Vector2;
})();

module.exports = Vector2;
//# sourceMappingURL=vector2.js.map