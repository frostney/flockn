import Base from './Base';
import Behavior from './Behavior';
import Graphics from './Graphics';
import Model from './Model';
import Texture from './Texture';

import { Vector2, Vector3, Color, Rect } from './types';

import { addable, renderable, updateable, serializable } from './mixins';

class GameObject extends Base {
  constructor(descriptor) {
    super(descriptor);

    this.visible = true;

    this.position = new Vector3();

    this.fitToTexture = true;

    // Create a new texture and bind it to the `texture` property
    this.texture = new Texture();
    this.texture.parent = this;

    // Once the image is loaded, update width and height if `fitToTexture` is set
    this.texture.on('image-loaded', () => {
      if (this.fitToTexture) {
        this.width = this.texture.image.width;
        this.height = this.texture.image.height;

        this.origin.x = this.width / 2;
        this.origin.y = this.height / 2;
      }

      // TODO: Evaluate if the Graphics trigger should only be in the texture
      Graphics.trigger('texture-image-loaded', this, this.texture);
    });

    // Once the label is loaded, update width and height if `fitToTexture` is set
    this.texture.on('label-loaded', () => {
      if (this.fitToTexture) {
        this.width = this.texture.label.width;
        this.height = this.texture.label.height;

        this.origin.x = this.width / 2;
        this.origin.y = this.height / 2;

        // TODO: Evaluate if the Graphics trigger should only be in the texture
        Graphics.trigger('texture-label-loaded', this, this.texture);
      }
    });

    this.width = 0;
    this.height = 0;

    this.angle = 0;

    this.alpha = 1;

    this.scale = new Vector2(1, 1);

    this.origin = new Vector2(this.width / 2, this.width / 2);

    this.border = {
      width: 0,
      color: new Color(),
      radius: 0,
    };

    // Add default model
    const defaultModel = new Model();
    defaultModel.name = 'default';

    this.addModel(defaultModel);

    // Mix in renderable and updateable
    renderable.call(this);
    updateable.call(this);
  }

  get left() {
    return this.position.x;
  }

  set left(value) {
    this.position.x = value;
  }

  get top() {
    return this.position.y;
  }

  set top(value) {
    this.position.y = value;
  }

  get right() {
    return this.parent.width - this.width - this.position.x;
  }

  set right(value) {
    this.position.x = this.parent.width - this.width - value;
  }

  get bottom() {
    return this.parent.height - this.height - this.position.y;
  }

  set bottom(value) {
    this.position.y = this.parent.height - this.height - value;
  }

  bounds() {
    // TODO: Also take care of scale
    // TODO: Also take care of rotation
    return new Rect(this.position.x, this.position.y, this.width, this.height);
  }

  addGameObject(...args: GameObject[]) {
    // Add a game object to this game object
    this.queue.push(addable(GameObject, this.children).apply(this, args));
  }

  addBehavior(...args: Behavior[]) {
    // Add a `Behavior` instance to the the game object and update the `gameObject` property
    this.queue.push(addable(Behavior, this.children, (child) => {
      /* eslint no-param-reassign: 0 */

      child.gameObject = this;
    }).apply(this, args));
  }

  addModel(...args) {
    // Add a `Model` instance to the game object
    this.queue.push(addable(Model, this.children).apply(this, args));
  }

  data(name) {
    if (!name) {
      return this.models.byName('default');
    }

    return this.models.byName(name);
  }

  /* animate(property, end, time, callback) {
    // TODO: Tweening does not work yet
    if (typeof this[property] === 'number') {
      const distance = end - this[property];
      var timeInS = (time / 1000);

      var animateName = 'animate-' + Date.now();
      this.on(animateName, function(dt) {

        this.off(animateName);
      });
    }
  } */

  static fromString() {}
}

serializable(GameObject);

export default GameObject;
