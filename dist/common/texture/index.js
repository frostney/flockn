"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Color = require("flockn/types").Color;

var EventMap = _interopRequire(require("eventmap"));

var TextureImage = _interopRequire(require("flockn/texture/image"));

var TextureLabel = _interopRequire(require("flockn/texture/label"));

var serializable = _interopRequire(require("flockn/mixins/serializable"));

var Texture = (function (_EventMap) {
  function Texture() {
    var _this = this;

    _classCallCheck(this, Texture);

    _EventMap.call(this);

    // Set up dimensions
    this.width = 0;
    this.height = 0;

    // Set parent property
    this.parent = null;

    this.image = new TextureImage(this);
    this.label = new TextureLabel(this);

    this.backgroundColor = Color.transparent();

    // TODO: What to do when there is both an image and a label
    this.on("image-loaded", function () {
      _this.width = _this.image.width;
      _this.height = _this.image.height;
    });

    this.on("label-loaded", function () {
      _this.width = _this.label.width;
      _this.height = _this.label.height;
    });
  }

  _inherits(Texture, _EventMap);

  return Texture;
})(EventMap);

serializable(Texture);

module.exports = Texture;
//# sourceMappingURL=index.js.map