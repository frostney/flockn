import {Color, Vector2} from 'flockn/types';
import serializable from 'flockn/mixins/serializable';

class TextureImage {
  constructor(texture) {
    // The default values for `image`
    this.color = Color.transparent();
    this.drawable = false;
    this.offset = new Vector2(0, 0);
    this.data = null;
    this.width = 0;
    this.height = 0;

    var filename = '';

    Object.defineProperty(this, 'filename', {
      get: function () {
        return filename;
      },
      set: function (value) {
        filename = value;

        // TODO: Most of this should already be handled by the preloader
        var img = new Image();
        img.src = filename;

        img.onload = () => {
          this.data = img;
          this.width = img.width;
          this.height = img.height;
          this.drawable = true;

          texture.trigger('image-loaded');
        };
      },
      enumerable: true
    });
  }

  toJSON() {
    return serialize.toJSON(this);
  }

  toString() {
    return serialize.toString(this);
  }
}

serializable(TextureImage);

export default TextureImage;
