"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _flocknTypes = require("flockn/types");

var Color = _flocknTypes.Color;
var Vector2 = _flocknTypes.Vector2;
var serializable = _interopRequire(require("flockn/mixins/serializable"));

var TextureImage = (function () {
  function TextureImage(texture) {
    _classCallCheck(this, TextureImage);

    // The default values for `image`
    this.color = Color.transparent();
    this.drawable = false;
    this.offset = new Vector2(0, 0);
    this.data = null;
    this.width = 0;
    this.height = 0;

    var filename = "";

    Object.defineProperty(this, "filename", {
      get: function () {
        return filename;
      },
      set: function (value) {
        var _this = this;
        filename = value;

        // TODO: Most of this should already be handled by the preloader
        var img = new Image();
        img.src = filename;

        img.onload = function () {
          _this.data = img;
          _this.width = img.width;
          _this.height = img.height;
          _this.drawable = true;

          texture.trigger("image-loaded");
        };
      },
      enumerable: true
    });
  }

  TextureImage.prototype.toJSON = function toJSON() {
    return serialize.toJSON(this);
  };

  TextureImage.prototype.toString = function toString() {
    return serialize.toString(this);
  };

  return TextureImage;
})();

serializable(TextureImage);

module.exports = TextureImage;
//# sourceMappingURL=image.js.map