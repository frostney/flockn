flockn
======

[![Build Status](https://travis-ci.org/freezedev/flockn.svg?branch=master)](https://travis-ci.org/freezedev/flockn)
[![devDependency Status](https://david-dm.org/freezedev/flockn/dev-status.svg)](https://david-dm.org/freezedev/flockn#info=devDependencies)

flockn is a lightweight game engine for JavaScript (and also languages that compile to JavaScript such as CoffeeScript or TypeScript).

Alternatives:
* If you are just interested in the DOM/jQuery side of things and wish more control over what's get added to the DOM, you should try [Lyria](https://github.com/freezedev/lyria).
* For a full-blown and less opiniated game engine, you could try [Phaser](https://github.com/photonstorm/phaser).

How does it work?
-----------------

```javascript
// Require the game module itself (here we're using AMD)
require(['flockn/game'], function(Game) {

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

Features
--------
* Taggable game objects and behaviors
* Small (less than 30kB minified)

Philosophy
----------
* Easy-to-use
* CoffeeScript-friendly
* Lightweight
* Events everywhere (Having an `EventEmitter`-like interface)
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
- [ ] Canvas renderer
- [ ] Serialization and deserialization
- [X] Documentation
- [ ] Examples
- [ ] Unit tests
- [ ] Default behaviors (e.g. sprite animation, collision)
- [ ] Audio
- [ ] Preloader/Assetloader
- [ ] Tweening
- [ ] Github page

Roadmap for future versions
---------------------------
- [ ] [PIXI](https://github.com/GoodBoyDigital/pixi.js) renderer

Some decisions that need to be made
-----------------------------------
- Should game objects have the attributes of behaviors?
- Should game objects have the attributes of models?
- Should `Object.observe` be used for attributes? (Reducing the `Model#get` and `Model#set` overhead)
- Is there a possibility to simplify the access of game objects from behaviors?

Building for yourself
---------------------
flockn uses Grunt. Grunt needs to be installed through `npm install -g grunt-cli`.  
After that, navigate to the flockn root folder and type `npm install` to install all necessary dependencies.  

Type `grunt` to build everything. You also need to have Bower installed to take a look at the examples.

License
-------
This is public domain. If public domain does not work for you, you can use MIT alternatively.
