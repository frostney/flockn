import Base from 'flockn/base';
import Behavior from 'flockn/behavior';
import Graphics from 'flockn/graphics';
import Group from 'flockn/group';
import Model from 'flockn/model';
import serialize from 'flockn/serialize';
import Texture from 'flockn/texture';

import {Vector2, Vector3, Color, Rect} from 'flockn/types';

import {addable, renderable, updateable} from 'flockn/mixins';


class GameObject extends Base {
  constructor(descriptor) {
    super('GameObject', descriptor);

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

    this.scale = new Vector2(1, 1);

    this.origin = new Vector2(this.width / 2, this.width / 2);

    this.border = {
      width: 0,
      color: new Color(),
      radius: 0
    };

    // Add default model
    var defaultModel = new Model();
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

  addGameObject() {
    // Add a game object to this game object
    this.queue.push(addable(GameObject, this.children).apply(this, arguments));
  }

  addBehavior() {
    // Add a `Behavior` instance to the the game object and update the `gameObject` property
    this.queue.push(addable(Behavior, this.children, function(child) {
      child.gameObject = this;
    }).apply(this, arguments));
  }

  addModel() {
    // Add a `Model` instance to the game object
    this.queue.push(addable(Model, this.children).apply(this, arguments));
  }

  removeGameObject() {

  }

  removeBehavior() {

  }

  removeModel() {

  }

  data(name) {
    if (!name) {
      return this.models.byName('default');
    } else {
      return this.models.byName(name);
    }
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

  toString() {
    return serialize(this);
  }

  // Game objects can be defined and are stored on the object itself
  static define(name, factory) {
    GameObject.store[name] = factory;
  }

  static fromString() {

  }
}

GameObject.store = {};

export default GameObject;
