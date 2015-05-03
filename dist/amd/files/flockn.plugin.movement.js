define('flockn/plugins/movement', ['exports', 'module', 'flockn/behavior', 'flockn/model', 'gamebox'], function (exports, module, _flocknBehavior, _flocknModel, _gamebox) {
  'use strict';

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

  var _Behavior = _interopRequire(_flocknBehavior);

  var _Model = _interopRequire(_flocknModel);

  var keyData = new _Model();

  keyData.name = 'keys';
  keyData.set('up', ['up', 'w']);
  keyData.set('down', ['down', 's']);
  keyData.set('left', ['left', 'a']);
  keyData.set('right', ['right', 'd']);

  var movements = ['up', 'down', 'left', 'right'];

  module.exports = function () {
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
});
