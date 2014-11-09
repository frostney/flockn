import * as clamp from 'clamp';
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

  toString() {
    if (this.a < 1) {
      return `rgba(${this.r},${this.g},${this.b},${this.a})`;
    } else {
      return `rgb(${this.r},${this.g},${this.b})`;
    }
  }
}

for (var colorName in colorConstants) {
  var colorValue = colorConstants[colorName];
  Color[colorName] = new Color(colorValue.r, colorValue.g, colorValue.b, colorValue.a);
}

export default Color;
