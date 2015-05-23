'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsCheckforflag = require('../utils/checkforflag');

var _utilsCheckforflag2 = _interopRequireDefault(_utilsCheckforflag);

var _graphics = require('../graphics');

var _graphics2 = _interopRequireDefault(_graphics);

var isVisible = _utilsCheckforflag2['default']('visible');

var renderable = function renderable() {
  var _this = this;

  this.on('render', function () {
    // Only render if element is visible
    if (!isVisible.call(_this)) {
      return;
    }

    // Emit `render` event on the `Graphics` object
    _graphics2['default'].trigger('render', _this);

    // Render all children elements
    _this.children.forEach(function (child) {
      return child.trigger('render');
    });
  });
};

exports['default'] = renderable;
module.exports = exports['default'];
//# sourceMappingURL=renderable.js.map