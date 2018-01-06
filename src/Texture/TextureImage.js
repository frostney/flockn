import { Color, Vector2 } from '../types';
import serializable from '../mixins/serializable';

class TextureImage {
  constructor(texture) {
    // The default values for `image`
    this.color = Color.transparent();
    this.drawable = false;
    this.offset = new Vector2(0, 0);
    this.data = null;
    this.width = 0;
    this.height = 0;

    let filename = '';

    Object.defineProperty(this, 'filename', {
      get: () => filename,
      set: function setFilename(value) {
        filename = value;

        // TODO: Most of this should already be handled by the preloader
        const img = new Image();
        img.src = filename;

        img.onload = () => {
          this.data = img;
          this.width = img.width;
          this.height = img.height;
          this.drawable = true;

          texture.trigger('image-loaded');
        };
      },
      enumerable: true,
    });
  }

  toJSON() {
    return serializable.toJSON(this);
  }

  toString() {
    return serializable.toString(this);
  }
}

serializable(TextureImage);

export default TextureImage;
