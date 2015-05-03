import {Math, Types} from 'gamebox';
import colorConstants from '../constants/color';

let {Color} = Types;

const {clamp} = Math;

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
