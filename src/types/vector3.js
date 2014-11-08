let sqrMagnitude = function(v) {
  return Vector3.dot(v, v);
};

class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
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

  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
  }

  subtract(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    this.z -= vector.z;
  }

  multiply(vector) {
    this.x *= vector.x;
    this.y *= vector.y;
    this.z *= vector.z;
  }

  divide(vector) {
    this.x /= vector.x;
    this.y /= vector.y;
    this.z /= vector.z;
  }

  normalize() {
    this.x = this.x / this.magnitude;
    this.y = this.y / this.magnitude;
    this.z = this.z / this.magnitude;
  }

  equals(v) {
    return (this.x === v.x && this.y === v.y && this.z === v.z);
  }
}

export default Vector3;
