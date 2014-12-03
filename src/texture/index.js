import {Color} from 'flockn/types';
import EventMap from 'eventmap';
import TextureImage from 'flockn/texture/image';
import TextureLabel from 'flockn/texture/label';
import serialize from 'flockn/serialize';

class Texture extends EventMap {
  constructor() {
    super();

    // Set up dimensions
    this.width = 0;
    this.height = 0;

    // Set parent property
    this.parent = null;

    this.image = new TextureImage(this);
    this.label = new TextureLabel(this);

    this.backgroundColor = Color.transparent();

    // TODO: What to do when there is both an image and a label
    this.on('image-loaded', () => {
      this.width = this.image.width;
      this.height = this.image.height;
    });

    this.on('label-loaded', () => {
      this.width = this.label.width;
      this.height = this.label.height;
    });
  }

  toJSON() {
    return serialize.toJSON(this);
  }

  toString() {
    return serialize.toString(this);
  }
}

export default Texture;
