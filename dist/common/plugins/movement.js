'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Behavior = require('flockn/behavior');

var _Behavior2 = _interopRequireWildcard(_Behavior);

var _Model = require('flockn/model');

var _Model2 = _interopRequireWildcard(_Model);

var _Input = require('gamebox');

var keyData = new _Model2['default']();

keyData.name = 'keys';
keyData.set('up', ['up', 'w']);
keyData.set('down', ['down', 's']);
keyData.set('left', ['left', 'a']);
keyData.set('right', ['right', 'd']);

var movements = ['up', 'down', 'left', 'right'];

exports['default'] = function () {
  var _this = this;

  this.addModel(keyData);

  this.input.key.on('down', function (key) {

    var upKeys = _this.data('keys').get('up');
    if (!Array.isArray(upKeys)) {
      upKeys = [upKeys];
    }

    _this.trigger('up');
    _this.trigger('down');
    _this.trigger('left');
    _this.trigger('right');
  });
};

module.exports = exports['default'];
//# sourceMappingURL=movement.js.map