"use strict";

var checkForFlag = function checkForFlag(property) {
  return function (obj) {
    obj = obj || this;

    var hasFlag = Object.hasOwnProperty.call(obj, property);

    if (hasFlag) {
      return obj[property];
    } else {
      return true;
    }
  };
};

module.exports = checkForFlag;
//# sourceMappingURL=checkforflag.js.map