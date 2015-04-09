"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
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

exports["default"] = checkForFlag;
module.exports = exports["default"];
//# sourceMappingURL=checkforflag.js.map