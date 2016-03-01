import {Color} from '../types';
import EventMap from 'eventmap';
import TextureImage from './image';
import TextureLabel from './label';
import serializable from '../mixins/serializable';

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
}

serializable(Texture);

export default Texture;
