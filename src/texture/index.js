import {Color} from 'flockn/types';
import EventMap from 'eventmap';
import TextureImage from 'flockn/texture/image';
import TextureLabel from 'flockn/texture/label';
import serialize from 'flockn/serialize';

class Texture extends EventMap {
  constructor() {
    super();

    var self = this;

    // Set up dimensions
    this.width = 0;
    this.height = 0;

    // Set parent property
    this.parent = null;

    this.image = new TextureImage(this);
    this.label = new TextureLabel(this);

    this.color = Color.white();
  }

  toString() {
    return serialize(this);
  }
}

export default Texture;
