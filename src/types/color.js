import clamp from 'clamp';
import colorConstants from 'flockn/constants/color';

class Color {
  constructor(r = 0, g = 0, b = 0, a = 1) {
    this.set(r, g, b, a);
  }

  set(r = 0, g = 0, b = 0, a = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  lighten(factor) {
    factor = clamp(factor, 0, 1);

    this.r = clamp(this.r + (factor * 255) | 0, 0, 255);
    this.g = clamp(this.g + (factor * 255) | 0, 0, 255);
    this.b = clamp(this.b + (factor * 255) | 0, 0, 255);
  }

  darken(factor) {
    factor = clamp(factor, 0, 1);

    this.r = clamp(this.r - (factor * 255) | 0, 0, 255);
    this.g = clamp(this.g - (factor * 255) | 0, 0, 255);
    this.b = clamp(this.b - (factor * 255) | 0, 0, 255);
  }

  fadeIn(factor) {
    factor = clamp(factor, 0, 1);

    this.a = this.a + this.a * factor;
    if (this.a > 1) {
      this.a = 1;
    }
  }

  fadeOut(factor) {
    factor = clamp(factor, 0, 1);

    this.a = this.a - this.a * factor;
    if (this.a < 0) {
      this.a = 0;
    }
  }

  toJSON() {
    if (this.a < 1) {
      if (this.a === 0) {
        return 'transparent';
      } else {
        return `rgba(${this.r},${this.g},${this.b},${this.a})`;
      }
    } else {
      return `rgb(${this.r},${this.g},${this.b})`;
    }
  }

  toString() {
    return this.toJSON();
  }

  toHex() {
    return `#${this.r.toString(16)}${this.g.toString(16)}${this.b.toString(16)}`;
  }

  // Getting a random color for debugging is quite useful sometimes
  static random() {
    var col = [0, 0, 0];

    col = col.map(function() {
      return ~~(Math.random() * 255);
    });

    return new Color(col[0], col[1], col[2]);
  }
}

for (var colorName in colorConstants) {
  var colorValue = colorConstants[colorName];

  (function(colorName, colorValue) {
    Color[colorName] = function() {
      var col = new Color(colorValue.r, colorValue.g, colorValue.b, colorValue.a);
      col.name = colorName;
      return col;
    };
  })(colorName, colorValue);
}

export default Color;
