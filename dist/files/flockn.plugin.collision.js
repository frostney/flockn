define('flockn/plugins/collision', ["exports", "flockn/behavior"], function (exports, _flocknBehavior) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var Behavior = _interopRequire(_flocknBehavior);

  Behavior.define("collision", function () {
    this.update(function (dt) {});
  });
});