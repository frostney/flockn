'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _types = require('../types');

var _mixinsSerializable = require('../mixins/serializable');

var _mixinsSerializable2 = _interopRequireDefault(_mixinsSerializable);

var TextureImage = (function () {
  function TextureImage(texture) {
    _classCallCheck(this, TextureImage);

    // The default values for `image`
    this.color = _types.Color.transparent();
    this.drawable = false;
    this.offset = new _types.Vector2(0, 0);
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

_mixinsSerializable2['default'](TextureImage);

exports['default'] = TextureImage;
module.exports = exports['default'];
//# sourceMappingURL=image.js.map