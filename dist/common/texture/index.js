'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _types = require('../types');

var _eventmap = require('eventmap');

var _eventmap2 = _interopRequireDefault(_eventmap);

var _image = require('./image');

var _image2 = _interopRequireDefault(_image);

var _label = require('./label');

var _label2 = _interopRequireDefault(_label);

var _mixinsSerializable = require('../mixins/serializable');

var _mixinsSerializable2 = _interopRequireDefault(_mixinsSerializable);

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

        this.image = new _image2['default'](this);
        this.label = new _label2['default'](this);

        this.backgroundColor = _types.Color.transparent();

        // TODO: What to do when there is both an image and a label
        this.on('image-loaded', function () {
            _this.width = _this.image.width;
            _this.height = _this.image.height;
        });

        this.on('label-loaded', function () {
            _this.width = _this.label.width;
            _this.height = _this.label.height;
        });
    }

    _inherits(Texture, _EventMap);

    return Texture;
})(_eventmap2['default']);

_mixinsSerializable2['default'](Texture);

exports['default'] = Texture;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map