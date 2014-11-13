(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/plugins/collision', ["exports", "flockn/behavior"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("flockn/behavior"));
  }
})(function (exports, _flocknBehavior) {
  "use strict";

  var Behavior = _flocknBehavior.default;


  Behavior.define("collision", function () {
    this.update(function (dt) {});
  });
});