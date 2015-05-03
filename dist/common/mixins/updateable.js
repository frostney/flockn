'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _checkForFlag = require('../utils/checkforflag');

var _checkForFlag2 = _interopRequireWildcard(_checkForFlag);

var isStatic = _checkForFlag2['default']('static');

// TODO: This is not completely how I want it be as it only sets the children as static and not the element itself
// TODO: Evaluate if it's a good idea if static elements shouldn't be able to interact with - similar to PIXI's
//  interactive property
var updatable = function updateable() {
  var _this = this;

  // Update all children
  this.on('update', function (dt) {
    if (!isStatic.call(_this)) {
      return;
    }

    _this.children.forEach(function (child) {
      if (child.update) {
        child.trigger('update', dt);
      }
    });
  });
};

exports['default'] = updatable;
module.exports = exports['default'];
//# sourceMappingURL=updateable.js.map