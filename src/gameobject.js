import addable from 'flockn/addable';
import Base from 'flockn/base';
import Behavior from 'flockn/behavior';
import Graphics from 'flockn/graphics';
import Group from 'flockn/group';
import Model from 'flockn/model';
import renderable from 'flockn/renderable';
import serialize from 'flockn/serialize';
import Texture from 'flockn/texture';
import updateable from 'flockn/updateable';


class GameObject {
  constructor(descriptor) {
    Base.extend([this, GameObject.prototype], 'GameObject', descriptor);

    this.visible = true;

    this.x = 0;
    this.y = 0;
    this.z = 0;

    this.fitToTexture = true;

    // Create a new texture and bind it to the `texture` property
    this.texture = new Texture();
    this.texture.parent = this;

    // Once the image is loaded, update width and height if `fitToTexture` is set
    this.texture.on('image-loaded', () => {
      if (this.fitToTexture) {
        this.width = this.texture.image.width;
        this.height = this.texture.image.height;

        this.origin.x = (this.width / 2);
        this.origin.y = (this.height / 2);
      }

      // TODO: Evaluate if the Graphics trigger should only be in the texture
      Graphics.trigger('texture-image-loaded', this, this.texture);
    });

    // Once the label is loaded, update width and height if `fitToTexture` is set
    this.texture.on('label-loaded', () => {
      if (this.fitToTexture) {
        this.width = this.texture.label.width;
        this.height = this.texture.label.height;

        this.origin.x = (this.width / 2);
        this.origin.y = (this.height / 2);

        // TODO: Evaluate if the Graphics trigger should only be in the texture
        Graphics.trigger('texture-label-loaded', this, this.texture);
      }
    });

    this.width = 0;
    this.height = 0;

    this.angle = 0;

    this.alpha = 1;

    this.scale = {
      x: 1,
      y: 1
    };

    this.origin = {
      x: (this.width / 2),
      y: (this.width / 2)
    };

    this.border = {
      width: 0,
      color: 'rgb(0, 0, 0)',
      radius: 0
    };

    // Behaviors
    this.behaviors = new Group();

    // Data models
    this.models = new Group();

    // Mix in renderable and updateable
    renderable.call(this);
    updateable.call(this);

    // Update all behaviors as well
    this.on('update', () => {
      this.behaviors.forEach(function(behavior) {
        behavior.trigger('update');
      });
    });
  }

  get left() {
    return this.x;
  }

  set left(value) {
    this.x = value;
  }

  get top() {
    return this.y;
  }

  set top(value) {
    this.y = value;
  }

  get right() {
    return this.parent.width - this.width - this.x;
  }

  set right(value) {
    this.x = this.parent.width - this.width - value;
  }

  get bottom() {
    return this.parent.height - this.height - this.y;
  }

  set bottom(value) {
    this.y = this.parent.height - this.height - value;
  }

  addGameObject() {
    // Add a game object to this game object
    this.queue.push(addable(GameObject, this.children).apply(this, arguments));
  }

  addBehavior() {
    // Add a `Behavior` instance to the the game object and update the `gameObject` property
    this.queue.push(addable(Behavior, this.behaviors, function(child) {
      child.gameObject = this;
    }).apply(this, arguments));
  }

  addModel() {
    // Add a `Model` instance to the game object
    this.queue.push(addable(Model, this.models).apply(this, arguments));
  }

  removeGameObject() {

  }

  removeBehavior() {

  }

  removeModel() {

  }

  toJSON() {
    // Serialize this object
    return serialize(this);
  }

  animate(property, end, time, callback) {
    // TODO: Tweening does not work yet
    if ( typeof this[property] === 'number') {
      var distance = end - this[property];
      var timeInS = (time / 1000);

      var animateName = 'animate-' + Date.now();
      this.on(animateName, function(dt) {

        this.off(animateName);
      });
    }
  }

  // Game objects can be defined and are stored on the object itself
  static define(name, factory) {
    GameObject.store[name] = factory;
  }

  static fromJSON() {

  }
}

GameObject.store = {};

export default GameObject;
