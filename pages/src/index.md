---
template: index.jade
---

flockn is a lightweight game engine for JavaScript (and also languages that compile to JavaScript such as CoffeeScript or TypeScript).

Alternatives:

- If you are just interested in the DOM/jQuery side of things and wish more control over what's get added to the DOM, you should try [Lyria](https://github.com/freezedev/lyria).
- For a full-blown and less opiniated game engine, you could try [Phaser](https://github.com/photonstorm/phaser).

## How does it work?

```javascript
// Require the game module itself (here we're using AMD)
require(['flockn/game'], function (Game) {
  // Create a game instance, no need to store it as a variable
  new Game(function () {
    // The logic for the game itself

    // Add a scene to the game
    this.addScene(function () {
      // The logic for this scene

      // Give the scene a name
      this.name = 'myscene';

      // Create a new game object inside the scene
      this.addGameObject(function () {
        // The logic for this game object

        // Set the position for this game object
        this.x = 100;
        this.y = 100;

        // This game object now holds a label with the text "Hello World"
        this.texture.label.text = 'Hello World';
      });
    });

    // Start the game loop
    // Since only have one scene, we don't need to specify a scene name. In any other case it would be: `this.run('myscene');`
    this.run();
  });
});
```
