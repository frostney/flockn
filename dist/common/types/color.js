'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _gamebox = require('gamebox');

var _constantsColor = require('../constants/color');

var _constantsColor2 = _interopRequireDefault(_constantsColor);

var Color = _gamebox.Types.Color;
var clamp = _gamebox.Math.clamp;

for (var colorName in _constantsColor2['default']) {
  var colorValue = _constantsColor2['default'][colorName];

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