'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Math$Types = require('gamebox');

var _colorConstants = require('../constants/color');

var _colorConstants2 = _interopRequireWildcard(_colorConstants);

var Color = _Math$Types.Types.Color;
var clamp = _Math$Types.Math.clamp;

for (var colorName in _colorConstants2['default']) {
  var colorValue = _colorConstants2['default'][colorName];

  (function (colorName, colorValue) {
    Color[colorName] = function () {
      var col = new Color(colorValue.r, colorValue.g, colorValue.b, colorValue.a);
      col.name = colorName;
      return col;
    };
  })(colorName, colorValue);
}

exports['default'] = Color;
module.exports = exports['default'];
//# sourceMappingURL=color.js.map