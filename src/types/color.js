define(['clamp', 'flockn/constants/color'], function(clamp, colorConstants) {
  var Color = function(r, g, b, a) {
    this.r = r || 0;
    this.g = g || 0;
    this.b = b || 0;
    this.a = a || 1;
  };
  
  Color.prototype.lighten = function(factor) {
    factor = clamp(factor, 0, 1);
    
    this.r = clamp(this.r + (factor * 255) | 0, 0, 255);
    this.g = clamp(this.g + (factor * 255) | 0, 0, 255);
    this.b = clamp(this.b + (factor * 255) | 0, 0, 255);
  };
  
  Color.prototype.darken = function(factor) {
    factor = clamp(factor, 0, 1);
    
    this.r = clamp(this.r - (factor * 255) | 0, 0, 255);
    this.g = clamp(this.g - (factor * 255) | 0, 0, 255);
    this.b = clamp(this.b - (factor * 255) | 0, 0, 255);
  };
  
  Color.prototype.fadeIn = function(factor) {
    factor = clamp(factor, 0, 1);
    
    this.a = this.a + this.a * factor;
    if (this.a > 1) {
      this.a = 1;
    }
  };
  
  Color.prototype.fadeOut = function(factor) {
    factor = clamp(factor, 0, 1);
    
    this.a = this.a - this.a * factor;
    if (this.a < 0) {
      this.a = 0;
    }
  };
  
  Color.prototype.toString = function() {
    if (this.a < 1) {
      return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
    } else {
      return 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
    }
  };
  
  for (var colorName in colorConstants) {
    var colorValue = colorConstants[colorName];
    Color[colorName] = new Color(colorValue.r, colorValue.g, colorValue.b, colorValue.a);
  }
  
  return Color;
});