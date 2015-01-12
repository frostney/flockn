(function (factory) {
  if (typeof define === "function" && define.amd) {
    define('flockn/plugins/movement', ["exports", "flockn/behavior", "flockn/model", "gameboard"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("flockn/behavior"), require("flockn/model"), require("gameboard"));
  }
})(function (exports, _flocknBehavior, _flocknModel, _gameboard) {
  "use strict";

  var Behavior = _flocknBehavior.default;
  var Model = _flocknModel.default;
  var Input = _gameboard.Input;

  var keyData = new Model();

  keyData.name = "keys";
  keyData.set("up", ["up", "w"]);
  keyData.set("down", ["down", "s"]);
  keyData.set("left", ["left", "a"]);
  keyData.set("right", ["right", "d"]);

  var movements = ["up", "down", "left", "right"];

  Behavior.define("movement", function () {
    var _this = this;

    this.addModel(keyData);

    this.input.key.on("down", function (key) {
      var upKeys = _this.data("keys").get("up");
      if (!Array.isArray(upKeys)) {
        upKeys = [upKeys];
      }

      _this.trigger("up");
      _this.trigger("down");
      _this.trigger("left");
      _this.trigger("right");
    });
  });
});