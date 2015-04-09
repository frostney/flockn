'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Color = require('flockn/types');

var _serializable = require('flockn/mixins/serializable');

var _serializable2 = _interopRequireWildcard(_serializable);

var TextureLabel = function TextureLabel(texture) {
  _classCallCheck(this, TextureLabel);

  // Default value for `label`
  this.drawable = false;
  this.font = {
    size: 10,
    name: 'Arial',
    color: _Color.Color.black(),
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

_serializable2['default'](TextureLabel);

exports['default'] = TextureLabel;
module.exports = exports['default'];
//# sourceMappingURL=label.js.map