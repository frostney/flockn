let sqrMagnitude = function(v) {
  return Vector3.dot(v, v);
};

class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.set(x, y, z);
  }

  set(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  get magnitude() {
    return Math.sqrt(sqrMagnitude(this));
  }

  get sqrMagnitude() {
    return sqrMagnitude(this);
  }

  static dot(vec1, vec2) {
    return vec1.x * vec2.x + vec1.y * vec2.y + vec1.z * vec2.z;
  }

  static cross(vec1, vec2) {
    return new Vector3(vec1.y * vec2.z - vec2.y * vec1.z, vec1.z * vec2.x - vec2.z * vec1.x, vec1.x * vec2.y - vec2.x * vec1.y);
  }

  clone() {
    return new Vector2(this.x, this.y, this.z);
  }

  toJSON() {
    return this.clone();
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }

  static fromJSON(obj) {
    return new Vector3(obj.x, obj.y, obj.z);
  }

  static fromString(str) {
    return Vector3.fromJSON(JSON.parse(str));
  }

  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;

    return this;
  }

  subtract(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    this.z -= vector.z;

    return this;
  }

  multiply(vector) {
    this.x *= vector.x;
    this.y *= vector.y;
    this.z *= vector.z;

    return this;
  }

  divide(vector) {
    this.x /= vector.x;
    this.y /= vector.y;
    this.z /= vector.z;

    return this;
  }

  normalize() {
    this.x = this.x / this.magnitude;
    this.y = this.y / this.magnitude;
    this.z = this.z / this.magnitude;

    return this;
  }

  equals(v) {
    return (this.x === v.x && this.y === v.y && this.z === v.z);
  }

  static forward() {
    return new Vector3(0, 0, 1);
  }

  static right() {
    return new Vector3(1, 0, 0);
  }

  static one() {
    return new Vector3(1, 1, 1);
  }

  static up() {
    return new Vector3(0, 1, 0);
  }

  static zero() {
    return new Vector3(0, 0, 0);
  }
}

export default Vector3;
