"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var clamp = _interopRequire(require("clamp"));

var colorConstants = _interopRequire(require("flockn/constants/color"));

var Color = (function () {
  function Color() {
    var r = arguments[0] === undefined ? 0 : arguments[0];
    var g = arguments[1] === undefined ? 0 : arguments[1];
    var b = arguments[2] === undefined ? 0 : arguments[2];
    var a = arguments[3] === undefined ? 1 : arguments[3];
    _classCallCheck(this, Color);

    this.set(r, g, b, a);
  }

  Color.prototype.set = function set() {
    var r = arguments[0] === undefined ? 0 : arguments[0];
    var g = arguments[1] === undefined ? 0 : arguments[1];
    var b = arguments[2] === undefined ? 0 : arguments[2];
    var a = arguments[3] === undefined ? 1 : arguments[3];
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  };

  Color.prototype.lighten = function lighten(factor) {
    factor = clamp(factor, 0, 1);

    this.r = clamp(this.r + factor * 255 | 0, 0, 255);
    this.g = clamp(this.g + factor * 255 | 0, 0, 255);
    this.b = clamp(this.b + factor * 255 | 0, 0, 255);
  };

  Color.prototype.darken = function darken(factor) {
    factor = clamp(factor, 0, 1);

    this.r = clamp(this.r - factor * 255 | 0, 0, 255);
    this.g = clamp(this.g - factor * 255 | 0, 0, 255);
    this.b = clamp(this.b - factor * 255 | 0, 0, 255);
  };

  Color.prototype.fadeIn = function fadeIn(factor) {
    factor = clamp(factor, 0, 1);

    this.a = this.a + this.a * factor;
    if (this.a > 1) {
      this.a = 1;
    }
  };

  Color.prototype.fadeOut = function fadeOut(factor) {
    factor = clamp(factor, 0, 1);

    this.a = this.a - this.a * factor;
    if (this.a < 0) {
      this.a = 0;
    }
  };

  Color.prototype.toJSON = function toJSON() {
    if (this.a < 1) {
      if (this.a === 0) {
        return "transparent";
      } else {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
      }
    } else {
      return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
    }
  };

  Color.prototype.toString = function toString() {
    return this.toJSON();
  };

  Color.prototype.toHex = function toHex() {
    return "#" + this.r.toString(16) + "" + this.g.toString(16) + "" + this.b.toString(16);
  };

  // Getting a random color for debugging is quite useful sometimes
  Color.random = function random() {
    var col = [0, 0, 0];

    col = col.map(function () {
      return ~ ~(Math.random() * 255);
    });

    return new Color(col[0], col[1], col[2]);
  };

  return Color;
})();

for (var colorName in colorConstants) {
  var colorValue = colorConstants[colorName];

  (function (colorName, colorValue) {
    Color[colorName] = function () {
      var col = new Color(colorValue.r, colorValue.g, colorValue.b, colorValue.a);
      col.name = colorName;
      return col;
    };
  })(colorName, colorValue);
}

module.exports = Color;
//# sourceMappingURL=color.js.map