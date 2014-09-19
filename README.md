flockn
======

flockn is a lightweight game engine for JavaScript (and also languages that compile to JavaScript such as CoffeeScript or TypeScript).

Alternatives:
* If you are just interested in DOM/jQuery and wish more control, you should try [Lyria](https://github.com/freezedev/lyria).
* For a full-blown and less opiniated game engine, you could try [Phaser](https://github.com/photonstorm/phaser).

How does it work?
-----------------

```javascript
require(['flockn/game'], function(Game) {
  new Game(function() {
  
    this.addScene(function() {
    	this.name = 'myscene';
    	
    	this.addGameObject(function() {
    		this.x = 100;
    		this.y = 100;
    		
    		this.texture.label.text = 'Hello world';
    	});
    });
    
    this.run();
  
  });
});
```

Philosophy
----------
* Easy-to-use
* Lightweight
* Events everywhere

Roadmap for next release
------------------------
- [ ] Canvas renderer
- [ ] Serialization and deserialization
- [ ] API documentation
- [ ] Examples
- [ ] Unit tests

Roadmap for future versions
---------------------------
- [ ] [PIXI](https://github.com/GoodBoyDigital/pixi.js) renderer

Building for yourself
---------------------
Type `grunt` to build everything.

License
-------
This is public domain. If public domain does not work for you, you can use MIT alternatively.
