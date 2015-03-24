"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var EventMap = _interopRequire(require("eventmap"));

// `Graphics` is an instance of an `EventMap`
var Graphics = new EventMap();

// Special property `renderer` can be modified, but not deleted
Object.defineProperty(Graphics, "renderer", {
  value: null,
  writable: true,
  enumerable: true
});

module.exports = Graphics;
//# sourceMappingURL=index.js.map