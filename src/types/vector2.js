let sqrMagnitude = function(v) {
  return Vector2.dot(v, v);
};

class Vector2 {
  constructor(x = 0, y = 0) {
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

  clone() {
    return new Vector2(this.x, this.y);
  }

  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
  }

  subtract(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
  }

  multiply(vector) {
    this.x *= vector.x;
    this.y *= vector.y;
  }

  divide(vector) {
    this.x /= vector.x;
    this.y /= vector.y;
  }

  normalize() {
    this.x = this.x / this.magnitude;
    this.y = this.y / this.magnitude;
  }
}

export default Vector2;
