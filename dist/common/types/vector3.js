"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var sqrMagnitude = function (v) {
  return Vector3.dot(v, v);
};

var Vector3 = (function () {
  function Vector3() {
    var x = arguments[0] === undefined ? 0 : arguments[0];
    var y = arguments[1] === undefined ? 0 : arguments[1];
    var z = arguments[2] === undefined ? 0 : arguments[2];
    _classCallCheck(this, Vector3);

    this.set(x, y, z);
  }

  Vector3.prototype.set = function set() {
    var x = arguments[0] === undefined ? 0 : arguments[0];
    var y = arguments[1] === undefined ? 0 : arguments[1];
    var z = arguments[2] === undefined ? 0 : arguments[2];
    this.x = x;
    this.y = y;
    this.z = z;
  };

  Vector3.dot = function dot(vec1, vec2) {
    return vec1.x * vec2.x + vec1.y * vec2.y + vec1.z * vec2.z;
  };

  Vector3.cross = function cross(vec1, vec2) {
    return new Vector3(vec1.y * vec2.z - vec2.y * vec1.z, vec1.z * vec2.x - vec2.z * vec1.x, vec1.x * vec2.y - vec2.x * vec1.y);
  };

  Vector3.prototype.clone = function clone() {
    return new Vector3(this.x, this.y, this.z);
  };

  Vector3.prototype.toJSON = function toJSON() {
    return this.clone();
  };

  Vector3.prototype.toString = function toString() {
    return JSON.stringify(this.toJSON());
  };

  Vector3.fromJSON = function fromJSON(obj) {
    return new Vector3(obj.x, obj.y, obj.z);
  };

  Vector3.fromString = function fromString(str) {
    return Vector3.fromJSON(JSON.parse(str));
  };

  Vector3.prototype.add = function add(vector) {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;

    return this;
  };

  Vector3.prototype.subtract = function subtract(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    this.z -= vector.z;

    return this;
  };

  Vector3.prototype.multiply = function multiply(vector) {
    this.x *= vector.x;
    this.y *= vector.y;
    this.z *= vector.z;

    return this;
  };

  Vector3.prototype.divide = function divide(vector) {
    this.x /= vector.x;
    this.y /= vector.y;
    this.z /= vector.z;

    return this;
  };

  Vector3.prototype.normalize = function normalize() {
    this.x = this.x / this.magnitude;
    this.y = this.y / this.magnitude;
    this.z = this.z / this.magnitude;

    return this;
  };

  Vector3.prototype.equals = function equals(v) {
    return this.x === v.x && this.y === v.y && this.z === v.z;
  };

  Vector3.forward = function forward() {
    return new Vector3(0, 0, 1);
  };

  Vector3.right = function right() {
    return new Vector3(1, 0, 0);
  };

  Vector3.one = function one() {
    return new Vector3(1, 1, 1);
  };

  Vector3.up = function up() {
    return new Vector3(0, 1, 0);
  };

  Vector3.zero = function zero() {
    return new Vector3(0, 0, 0);
  };

  _prototypeProperties(Vector3, null, {
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
    }
  });

  return Vector3;
})();

module.exports = Vector3;
//# sourceMappingURL=vector3.js.map