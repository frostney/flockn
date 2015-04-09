'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Color$Vector2 = require('flockn/types');

var _serializable = require('flockn/mixins/serializable');

var _serializable2 = _interopRequireWildcard(_serializable);

var TextureImage = (function () {
  function TextureImage(texture) {
    _classCallCheck(this, TextureImage);

    // The default values for `image`
    this.color = _Color$Vector2.Color.transparent();
    this.drawable = false;
    this.offset = new _Color$Vector2.Vector2(0, 0);
    this.data = null;
    this.width = 0;
    this.height = 0;

    var filename = '';

    Object.defineProperty(this, 'filename', {
      get: function get() {
        return filename;
      },
      set: function set(value) {
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

          texture.trigger('image-loaded');
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

_serializable2['default'](TextureImage);

exports['default'] = TextureImage;
module.exports = exports['default'];
//# sourceMappingURL=image.js.map