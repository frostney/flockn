let sqrMagnitude = function(v) {
  return Vector2.dot(v, v);
};

class Vector2 {
  constructor(x = 0, y = 0) {
    this.set(x, y);
  }

  set(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  get magnitude() {
    return Math.sqrt(sqrMagnitude(this));
  }

  get sqrMagnitude() {
    return sqrMagnitude(this);
  }

  get angle() {
    return Math.atan2(this.x, this.y);
  }

  static dot(vec1, vec2) {
    return vec1.x * vec2.x + vec1.y * vec2.y;
  }

  static fromAngle(angle, magnitude) {
    return new Vector2(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
  }

  toJSON() {
    return this.clone();
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }

  static fromJSON(obj) {
    return new Vector2(obj.x, obj.y);
  }

  static fromString(str) {
    return Vector2.fromJSON(JSON.parse(str));
  }

  clone() {
    return new Vector2(this.x, this.y);
  }

  add(vector) {
    this.x += vector.x;
    this.y += vector.y;

    return this;
  }

  subtract(vector) {
    this.x -= vector.x;
    this.y -= vector.y;

    return this;
  }

  multiply(vector) {
    this.x *= vector.x;
    this.y *= vector.y;

    return this;
  }

  divide(vector) {
    this.x /= vector.x;
    this.y /= vector.y;

    return this;
  }

  normalize() {
    this.x = this.x / this.magnitude;
    this.y = this.y / this.magnitude;

    return this;
  }

  equals(v) {
    return (this.x === v.x && this.y === v.y);
  }
}

export default Vector2;
