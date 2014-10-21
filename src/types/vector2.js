define(function() {
  
  var sqrMagnitude = function(v) {
    return Vector2.dot(v, v);
  };
  
  var Vector2 = function(x, y) {
    this.x = this.x || 0;
    this.y = this.y || 0;
    
    Object.defineProperty(this, 'magnitude', {
      get: function() {
        return Math.sqrt(sqrMagnitude(this));
      }
    });
    
    Object.defineProperty(this, 'sqrMagnitude', {
      get: function() {
        return sqrMagnitude(this);
      }
    });
    
    Object.defineProperty(this, 'angle', {
      get: function() {
        return Math.atan2(this.y, this.x);
      }
    });
  };
  
  Vector2.dot = function(vec1, vec2) {
    return vec1.x * vec2.x + vec1.y * vec2.y;
  };
  
  Vector2.prototype.clone = function() {
    return new Vector2(this.x, this.y);
  };
  
  Vector2.prototype.add = function(vector) {
    this.x += vector.x;
    this.y += vector.y;
  };
  
  Vector2.prototype.subtract = function(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
  };
  
  Vector2.prototype.multiply = function(vector) {
    this.x *= vector.x;
    this.y *= vector.y;
  };
  
  Vector2.prototype.divide = function(vector) {
    this.x /= vector.x;
    this.y /= vector.y;
  };
  
  Vector2.prototype.normalize = function() {
    this.x = this.x / this.magnitude;
    this.y = this.y / this.magnitude;
  };
  
  Vector2.fromAngle = function(angle, magnitude) {
    return new Vector2(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
  };
  
  return Vector2;
  
});
