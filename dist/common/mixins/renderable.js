"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var checkForFlag = _interopRequire(require("flockn/utils/checkforflag"));

var Graphics = _interopRequire(require("flockn/graphics"));

var isVisible = checkForFlag("visible");

var renderable = function renderable() {
  var _this = this;

  this.on("render", function () {
    // Only render if element is visible
    if (!isVisible.call(_this)) {
      return;
    }

    // Emit `render` event on the `Graphics` object
    Graphics.trigger("render", _this);

    // Render all children elements
    _this.children.forEach(function (child) {
      return child.trigger("render");
    });
  });
};

module.exports = renderable;
//# sourceMappingURL=renderable.js.map