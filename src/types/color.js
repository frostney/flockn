/* eslint guard-for-in: 0 */
/* eslint no-loop-func: 0 */
/* eslint no-shadow: 0 */

import { Types } from 'gamebox';
import colorConstants from '../constants/color';

const { Color } = Types;

for (const colorName in colorConstants) {
  const colorValue = colorConstants[colorName];

  ((colorName, colorValue) => {
    Color[colorName] = () => {
      const col = new Color(colorValue.r, colorValue.g, colorValue.b, colorValue.a);
      col.name = colorName;
      return col;
    };
  })(colorName, colorValue);
}

export default Color;
