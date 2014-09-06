udefine('snowflake/addable', function() {
  return function(Factory, groupInstance) {

    return function() {
      var child = arguments[0];
      var args = 2 <= arguments.length ? [].slice.call(arguments, 1) : [];

      if (!( child instanceof Factory)) {
        if ( typeof child === 'string') {
          if (Object.hasOwnProperty.call(store, child)) {
            child = new Factory(Factory.store[child], args);
          }
        } else {
          child = new Factory(child, args);
        }
      }
      groupInstance.push(child);
      child.parent = this;
      child.trigger('add');
    };
  };
});

udefine('snowflake/base', ['eventmap', 'mixedice', './group'], function(EventMap, mixedice, Group) {
  
  var Base = function() {
    mixedice([this, Base.prototype], new EventMap());
    
    var type = arguments[0];
    var descriptor = arguments[1];
    var args = 3 <= arguments.length ? [].slice.call(arguments, 2) : [];
    
    this.type = type;
    this.name = this.type + '-' + Date.now();
    
    this.children = new Group();
    
    this.parent = null;
    
    if (descriptor) {
    	descriptor.apply(this, args);
    }
    
    this.trigger('create');
  };
  
  return Base;
  
});

udefine('snowflake/behavior', ['mixedice', './addable', './base', './constructable',  './group'], function(mixedice, addable, Base, constructable, Group) {

  var Behavior = function() {
    var self = this;
    
    mixedice([this, Behavior.prototype], constructable(Base, 'Behavior', arguments));
    
    this.on('update', function(dt) {
      self.children.forEach(function(child) {
        child.trigger('update', dt);
      });
    });
  };

  Behavior.prototype.addBehavior = function() {
    addable(Behavior, this.children).apply(this, arguments);
  };


  Behavior.store = {};

  Behavior.define = function(name, factory) {
    Behavior.store[name] = factory;
  };

  return Behavior;
}); 
udefine('snowflake/constructable', function() {
	return function(constructor, type, args) {
		var argArray = (Array.isArray(args)) ? args : [].slice.call(args);
		
		argArray.unshift(type);
		var Factory = constructor.bind.apply(constructor, argArray);
		return new Factory();
	};
});

udefine('snowflake/game', ['mixedice', './addable', './base', './constructable', './scene'], function(mixedice, addable, Base, constructable, Scene) {
  var Game = function() {
    mixedice([this, Game.prototype], constructable(Base, 'Game', arguments));
  };
  
  Game.prototype.addScene = function(name) {
    addable(Scene, this.children).apply(this, arguments);
  };
  
  Game.prototype.showScene = function(name) {
    this.activeScene = name;
  };
  
  return Game;
});

udefine('snowflake/gameobject', ['mixedice', './addable', './base', './behavior', './constructable', './graphics', './group'], function(mixedice, addable, Base, Behavior, constructable, Graphics, Group) {
  var GameObject = function() {
    mixedice([this, GameObject.prototype], constructable(Base, 'GameObject', arguments));
    
    var self = this;
    
    this.x = 0;
    this.y = 0;
    
    this.parent = null;
    
    // Behaviors
    this.behaviors = new Group();
    
    // Data models
    this.models = new Group();
    
    this.on('render', function() {
    	Graphics.trigger('render', self.type, self);
    	
      self.children.forEach(function(child) {
        child.trigger('render');
      });
    });
    
    this.on('update', function() {
      self.children.forEach(function(child) {
        child.trigger('update');
      });
      
      self.behaviors.forEach(function(behavior) {
        behavior.trigger('update');
      });
    });
  };
  
  GameObject.store = {};
  
  GameObject.define = function(name, factory) {
    GameObject.store[name] = factory;
  };
  
  GameObject.prototype.addGameObject = function() {
    addable(GameObject, this.children).apply(this, arguments);
  };
  
  GameObject.prototype.addBehavior = function() {
    addable(Behavior, this.behaviors).apply(this, arguments);
  };
  
  return GameObject;
});

udefine('snowflake/graphics', ['eventmap'], function(EventMap) {
	var Graphics = new EventMap();
	
	return Graphics;
});

udefine('snowflake/graphics/dom', ['../graphics'], function(Graphics) {
	
	Graphics.init = function(container) {
		Graphics.renderer = 'DOM';
		Graphics.container = container;
	};
	
	Graphics.on('render', function(type, obj) {
		
		switch (type) {
			case 'GameObject':
				break;
			default:
				break;
		}
		
	});
	
	return Graphics;
	
});

udefine('snowflake/group', [], function() {
  var unidentified = 'untitled';
  var unidentifiedCounter = 0;

  var Group = function() {
    this.length = 0;

    this.tags = {};
    this.names = {};
  };

  Group.prototype.push = function(obj, tags) {    
    var name = obj.name || (unidentified + unidentifiedCounter++);
    if (tags == null) {
      tags = obj.tags || [];      
    }

    if (Object.hasOwnProperty.call(this.names, name)) {
      return;
    }
    
    this[this.length] = obj;
    
    this.tags.forEach(function(tag) {
      this.tags[tag] = this.tags[tag] || [];
      this.tags[tag].push(this.length);
    }, this);
    
    this.names[name] = this.length;

    return ++this.length;
  };
  
  // TODO: Behavior currently stays in the list
  Group.prototype.pop = function() {    
    return this[this.length];
  };

  Group.prototype.splice = function(index, how) {
    
  };
  
  Group.prototype.slice = function(begin, end) {
    if (end == null) {
      end = this.length;
    }
    
    var slicedGroup = new Group();
    
    for (var i = begin; i < end; i++) {
      slicedGroup.push(this[i]);
    }
    
    return slicedGroup;
  };
  
  Group.prototype.forEach = function(callback) {
    for (var i = 0; i < this.length; i++) {
      callback(this[i]);
    }
  };
  
  Group.prototype.filter = function(callback) {
    var filteredArray = [];
    
    for (var i = 0; i < this.length; i++) {
      if (callback(this[i])) {
        filteredArray.push(this[i]);
      }
    }
    
    return filteredArray;
  };
  
  Group.prototype.byName = function(name) {
    return this[this.names[name]];
  };
  
  Group.prototype.byTag = function(tag) {
    return this.tags[tag].map(function(index) {
      return this[index];
    }, this);
  };

  return Group;
});

udefine('snowflake/scene', ['mixedice', './addable', './base', './constructable', './group', './gameobject'], function(mixedice, addable, Base, constructable, Group, GameObject) {
  
  var Scene = function() {
    mixedice([this, Scene.prototype], constructable(Base, 'Scene', arguments));
  };
  
  Scene.prototype.addGameObject = function() {
    addable(GameObject, this.children).apply(this, arguments);
  };
  
  Scene.store = {};
  
  Scene.define = function(name, factory) {
    Scene.store[name] = factory;
  };
  
  return Scene;
  
});
