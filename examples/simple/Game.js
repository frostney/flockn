import flockn from 'flockn';

flockn(function () {

  // Set the width & height of the game
  this.width = 300;
  this.height = 300;

  // Add a new scene
  this.addScene(function () {

    // Add a new object onto the scene
    this.addGameObject(function () {
      var _this = this;
      // Set its name
      this.name = 'myGameObject';

      // Load an image for the texture
      this.texture.image.filename = 'hero_front.png';

      this.input.key.on('down', function (keyCode) {
        if (keyCode === this.up || keyCode === this.w) {
          _this.position.y -= 10;
        }

        if (keyCode === this.down || keyCode === this.s) {
          _this.position.y += 10;
        }

        if (keyCode === this.left || keyCode === this.a) {
          _this.position.x -= 10;
        }

        if (keyCode === this.right || keyCode === this.d) {
          _this.position.x += 10;
        }
      });

      this.on('click', function () {
        alert('You clicked that hero guy.');
      });

      this.on('update', function (dt) {
        return _this.angle += (dt * 10);
      });
    });

    this.addGameObject(function () {
      this.texture.backgroundColor.set(255, 0, 0);

      this.position.x = 100;
      this.position.y = 100;

      this.width = 80;
      this.height = 80;
    });

    this.addGameObject(function () {
      this.texture.label.text = 'Hello World';

      this.top = 8;
      this.right = 8;
    });
  });

  this.run();

});
