// Import canvas renderer
import Renderer from 'flockn/renderer/canvas';

// Import Game object
import Game from 'flockn/game';

// Create a new game instance
new Game(function() {

  // Set the width & height of the game
  this.width = 300;
  this.height = 300;

  // Add a new scene
  this.addScene(function() {

    // Add a new object onto the scene
    this.addGameObject(function() {
      // Set its name
      this.name = 'myGameObject';

      // Load an image for the texture
      this.texture.image.filename = 'hero_front.png';

      this.input.key.on('down', (keyCode) => {
        if (keyCode === this.up || keyCode === this.w) {
          self.position.y -= 10;
        }

        if (keyCode === this.down || keyCode === this.s) {
          self.position.y += 10;
        }

        if (keyCode === this.left || keyCode === this.a) {
          self.position.x -= 10;
        }

        if (keyCode === this.right || keyCode === this.d) {
          self.position.x += 10;
        }
      });

      this.on('update', dt => this.angle += (dt * 10));
    });

    this.addGameObject(function() {
      this.texture.color.set(255, 0, 0);

      this.position.x = 100;
      this.position.y = 100;

      this.width = 80;
      this.height = 80;
    });

    this.addGameObject(function() {
      this.texture.label.text = 'Hello World';

      this.top = 8;
      this.right = 8;
    });
  });

  this.run();

});
