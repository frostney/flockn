define('flockn/plugins/movement', ["exports", "flockn/behavior", "flockn/model", "gameboard"], function (exports, _flocknBehavior, _flocknModel, _gameboard) {
  "use strict";

  var _interopRequire = function (obj) {
    return obj && (obj["default"] || obj);
  };

  var Behavior = _interopRequire(_flocknBehavior);

  var Model = _interopRequire(_flocknModel);

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