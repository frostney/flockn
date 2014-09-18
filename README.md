Snowflake
=========

Snowflake is a micro-game engine for JavaScript (and also languages that compile to JavaScript such as CoffeeScript or TypeScript).

How does it work?
-----------------

```javascript
require(['flocken/game'], function(Game) {
  new Game(function() {
  
    this.addScene(function() {
    	this.name = 'myscene';
    	
    	this.addGameObject(function() {
    		this.x = 100;
    		this.y = 100;
    	});
    });
  
  });
});
```

Philosophy
----------


Building for yourself
---------------------
Type `grunt` to build everything.

License
-------
This is public domain. If public domain does not work for you, you can use MIT alternatively.
