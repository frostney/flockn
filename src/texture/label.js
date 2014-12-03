import {Color} from 'flockn/types';
import serialize from 'flockn/serialize';

class TextureLabel {
  constructor(texture) {
    // Default value for `label`
    this.drawable = false;
    this.font = {
      size: 10,
      name: 'Arial',
      color: Color.black(),
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
      get: function () {
        return text;
      },
      set: function (value) {
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

        this.font.decoration.forEach(decoration => {
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
  }

  toJSON() {
    return serialize.toJSON(this);
  }

  toString() {
    return serialize.toString(this);
  }
}

export default TextureLabel;
