'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _checkForFlag = require('flockn/utils/checkforflag');

var _checkForFlag2 = _interopRequireWildcard(_checkForFlag);

var _Graphics = require('flockn/graphics');

var _Graphics2 = _interopRequireWildcard(_Graphics);

var isVisible = _checkForFlag2['default']('visible');

var renderable = function renderable() {
  var _this = this;

  this.on('render', function () {
    // Only render if element is visible
    if (!isVisible.call(_this)) {
      return;
    }

    // Emit `render` event on the `Graphics` object
    _Graphics2['default'].trigger('render', _this);

    // Render all children elements
    _this.children.forEach(function (child) {
      return child.trigger('render');
    });
  });
};

exports['default'] = renderable;
module.exports = exports['default'];
//# sourceMappingURL=renderable.js.map