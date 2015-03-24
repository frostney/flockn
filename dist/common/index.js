"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var Game = _interopRequire(require("flockn/game"));

var GameObject = _interopRequire(require("flockn/gameobject"));

var Scene = _interopRequire(require("flockn/scene"));

var Behavior = _interopRequire(require("flockn/behavior"));

var flockn = function flockn(descriptor) {
  return new Game(descriptor);
};

flockn.gameObject = function (name, factory) {
  return GameObject.define(name, factory);
};

flockn.scene = function (name, factory) {
  return Scene.define(name, factory);
};

flockn.behavior = function (name, factory) {
  return Behavior.define(name, factory);
};

module.exports = flockn;
//# sourceMappingURL=index.js.map