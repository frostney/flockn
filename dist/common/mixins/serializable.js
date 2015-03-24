"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var serialize = _interopRequire(require("flockn/serialize"));

var serializable = function serializable(Factory) {
  Factory.prototype.toJSON = function () {
    return serialize.toJSON(this);
  };

  Factory.prototype.toString = function () {
    return serialize.toString(this);
  };
};

module.exports = serializable;
//# sourceMappingURL=serializable.js.map