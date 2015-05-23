'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _types = require('../types');

var _mixinsSerializable = require('../mixins/serializable');

var _mixinsSerializable2 = _interopRequireDefault(_mixinsSerializable);

var TextureLabel = function TextureLabel(texture) {
  _classCallCheck(this, TextureLabel);

  // Default value for `label`
  this.drawable = false;
  this.font = {
    size: 10,
    name: 'Arial',
    color: _types.Color.black(),
    decoration: []
  };

  this.align = {
    x: 'center',
    y: 'center'
  };
  this.width = 0;
  this.height = 0;

  var text = '';

  Object.defineProperty(this, 'text', {
    get: function get() {
      return text;
    },
    set: function set(value) {
      text = value;

      // Calculate the size of the label and update the dimensions
      // TODO: This should be handled somewhere else, but I'm not sure where
      var tmpElem = document.createElement('div');
      tmpElem.innerText = text;
      tmpElem.style.position = 'absolute';
      tmpElem.style.left = '-9999px';
      tmpElem.style.top = '-9999px';
      tmpElem.style.fontSize = this.font.size + 'px';
      tmpElem.style.fontFamily = this.font.name;
      tmpElem.style.color = this.font.color;

      this.font.decoration.forEach(function (decoration) {
        switch (decoration) {
          case 'bold':
            tmpElem.style.fontWeight = 'bold';
            break;
          case 'italic':
            tmpElem.style.fontStyle = 'italic';
            break;
          case 'underline':
            tmpElem.style.textDecoration = 'underline';
            break;
          default:
            break;
        }
      });

      document.body.appendChild(tmpElem);

      this.width = tmpElem.clientWidth;
      this.height = tmpElem.clientHeight;
      this.drawable = true;

      document.body.removeChild(tmpElem);

      texture.trigger('label-loaded');
    }
  });
};

_mixinsSerializable2['default'](TextureLabel);

exports['default'] = TextureLabel;
module.exports = exports['default'];
//# sourceMappingURL=label.js.map