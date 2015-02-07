flockn
======

[![Build Status](https://travis-ci.org/freezedev/flockn.svg?branch=master)](https://travis-ci.org/freezedev/flockn)
[![devDependency Status](https://david-dm.org/freezedev/flockn/dev-status.svg)](https://david-dm.org/freezedev/flockn#info=devDependencies)

flockn is a lightweight ECMAScript 6 game engine. (It currently uses [6to5](https://github.com/6to5/6to5) to generate ECMAScript 5 compatible output.)

Alternatives:
* If you are just interested in the DOM/jQuery side of things and wish more control over what's getting added to the DOM, you should try [Lyria](https://github.com/freezedev/lyria).
* For a full-blown and less opiniated game engine, you could try [Phaser](https://github.com/photonstorm/phaser).

How does it work?
-----------------

```javascript
import Game from 'flockn/game';

// Create a game instance, no need to store it as a variable
new Game(function() {
  // The logic for the game itself

  // Add a scene to the game
  this.addScene(function() {
    // The logic for this scene

    // Give the scene a name
      this.name = 'myscene';

      // Create a new game object inside the scene
      this.addGameObject(function() {
        // The logic for this game object

        // Set the position for this game object
          this.position.x = 100;
          this.position.y = 100;

          // This game object now holds a label with the text "Hello World"
          this.texture.label.text = 'Hello World';
      });
  });

  // Start the game loop
  // Since only have one scene, we don't need to specify a scene name.
  // In any other case it would be: `this.run('myscene');`
  this.run();

});
```
Putting everything in one file doesn't work for anything bigger than a small experiment, so I would recommend to
to put each gameobjects, behaviors and scene in separate files. For a more real-life example, take a look at the
template.

Features
--------
* Taggable game objects and behaviors
* Small (less than 30kB minified)

Philosophy
----------
* Friendly to JavaScript transpilers: CoffeeScript, TypeScript and more
* Transpilers are optional though: You don't need to use a transpiler with `flockn`
* Lightweight
* Events everywhere (Having an `EventEmitter`-like interface)
* Pluggable
* Over-simplification of things. Examples:
  * A flockn game instance binds scenes on itself. In other game engines, a scene director usually handles it and is mounted to the game/application instance
  * A texture can either be an image, a text, a color or a combination of these
* Functions are the best way to describe an object
* Split entity-component model into 
    * Game objects (base object)
    * Behaviors (logic) 
    * Models (data)

Status of renderers
-------------------
* DOM renderer: ~80%
* Canvas renderer: ~60%

Roadmap for next release
------------------------
- [X] Canvas renderer
- [X] Serialization
- [X] Deserialization
- [X] Documentation
- [ ] Examples
- [X] Unit tests
- [ ] Default behaviors (e.g. sprite animation, collision)
- [ ] Audio
- [ ] Preloader/Assetloader
- [ ] Tweening
- [ ] Github page

Roadmap for future versions
---------------------------
- [ ] [PIXI](https://github.com/GoodBoyDigital/pixi.js) renderer
- [ ] WebGL renderer

Some decisions that need to be made
-----------------------------------
- What is the best way to access game and world instances? Binding it to `this` doesn't seem logical, as its not a child from the object, but the other way around
- Should game objects have the attributes of behaviors?
- Should game objects have the attributes of models?
- Should `Object.observe` be used for attributes? (Reducing the `Model#get` and `Model#set` overhead)
- Is there a possibility to simplify the access of game objects from behaviors?

Building for yourself
---------------------
flockn uses Grunt as its task runner
Grunt can either be installed through `npm install -g grunt-cli` or you can use it as a local dependency.
After that, navigate to the flockn root folder and type `npm install` to install all necessary dependencies.  

Type `grunt` (or `npm run grunt`) to build everything. You also need to have Bower installed to take a look at the examples.

License
-------
This is public domain (UNLICENSE). If public domain does not work for you, you can use MIT alternatively.
