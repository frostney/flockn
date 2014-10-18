define(function() {
  
  var Vector2 = function(x, y) {
    this.x = this.x || 0;
    this.y = this.y || 0;
    
    Object.defineProperty(this, 'length', {
      get: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
      }
    });
    
    Object.defineProperty(this, 'angle', {
      get: function() {
        return Math.atan2(this.y, this.x);
      }
    });
  };
  
  Vector2.add = function(vector) {
    this.x += vector.x;
    this.y += vector.y;
  };
  
  Vector2.subtract = function(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
  };
  
  Vector2.multiply = function(vector) {
    this.x *= vector.x;
    this.y *= vector.y;
  };
  
  Vector2.divide = function(vector) {
    this.x /= vector.x;
    this.y /= vector.y;
  };
  
  Vector2.fromAngle = function(angle, magnitude) {
    return new Vector2(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
  };
  
  return Vector2;
  
});
