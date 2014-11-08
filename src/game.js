import * as Loop from 'gameboard/loop';

import addable from 'flockn/addable';
import Base from 'flockn/base';
import Graphics from 'flockn/graphics';
import Scene from 'flockn/scene';
import renderable from 'flockn/renderable';
import Color from 'flockn/types/color';
import updateable from 'flockn/updateable';
import Viewport from 'flockn/viewport';

var root = window;

// Game is the entry point for all games made with flockn.
// Any number of `Scene` instances can be attached to a `Game` instance
class Game extends Base {
  constructor(descriptor) {
    // The new operator does not need to be set explicitly.
    // If it isn't we return an instance of `Game`
    if (!this || !this instanceof Game) {
      return new Game(descriptor);
    }

    // Extend the `Base` class
    super('Game', descriptor);

    descriptor.call(this);

    Graphics.trigger('initialize', this);

    // `this.container` is a string, which is the id of the element.
    // If it's not given, it should create a new element. This should be handled by the renderer.
    this.container = null;

    // By default, the width and height of a `Game` instance will be as large as the inside of the browser window.
    this.width = root.innerWidth;
    this.height = root.innerHeight;
    this.color = new Color(255, 255, 255);

    // Set the viewport object
    this.viewport = Viewport;

    // `this.activeScene` is set to `null` by default, but will change once a scene will be shown
    this.activeScene = null;

    // A `Game` instance is the root element so the descriptor needs to be called directly,
    // because it won't be added to anywhere else
    this.call();

    // Mix in `renderable` and `updateable`
    renderable.call(this);
    updateable.call(this);

    // Bind the game loop to the `update` event
    Loop.on('update', (dt) => {
      // Deltatime should not be a millisecond value, but a second one.
      // It should be a value between 0 - 1
      this.trigger('update', dt / 1000);
    });

    // Bind the game loop to the `render` event
    Loop.on('render', () => {
      this.trigger('render');
    });

    // Add a `resize` event to each `Game` instance
    root.addEventListener('resize', () => {
      var newWidth = root.innerWidth;
      var newHeight = root.innerHeight;

      this.trigger('resize', newWidth, newHeight);

      // Trigger resize event for the current scene
      this.activeScene.trigger('resize', newWidth, newHeight);
    }, false);

    // Add an `orientationchange` event to each `Game` instance
    root.addEventListener('orientationchange', () => {
      this.trigger('orientationchange');
    }, false);
  }

  addScene() {
    // When adding a scene, the dimension of scenes should be
    // exactly as large as the `Game` instance itself
    this.queue.push(addable(Scene, this.children, function (child) {
      child.width = this.width;
      child.height = this.height;
    }).apply(this, arguments));
  }

  showScene(name) {
    // TODO: Add transitions

    // Set the `activeScene` property
    this.activeScene = name;

    // Call resize event
    this.children[this.activeScene].trigger('resize', root.innerWidth, root.innerHeight);

    // Trigger the `show` event
    this.trigger('show', this.activeScene, this.children[this.activeScene]);
  }

  preload(assets) {

  }

  run(name) {
    // Start the game loop
    Loop.run();

    if (!name) {
      // If there's only one scene, specifying a name is not necessary
      if (this.children.length === 1) {
        name = this.children[0].name;
      }
    }

    // Show the scene if a parameter has been specified
    if (name) {
      this.showScene(name);
    }
  }
}

export default Game;
