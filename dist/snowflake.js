udefine('addable', function() {
  return function(Factory, groupInstance) {

    return function(child) {
      var child = arguments[0];
      var args = 2 <= arguments.length ? [].slice.call(arguments, 1) : [];

      if (!( child instanceof child)) {
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
    };
  };
});

udefine('snowflake/base', ['eventmap', 'mixedice', './group'], function(EventMap, mixedice, Group) {
  
  var Base = function() {
    mixedice([this, Base.prototype], new EventMap());
    
    var type = arguments[0];
    var descriptor = arguments[1];
    
    this.type = type;
    this.name = this.type + '-' + Date.now();
    
    this.children = new Group();
    
    this.parent = null;
    
    this.trigger('create');
  };
  
  return Base;
  
});

udefine('snowflake/behavior', ['eventmap', 'mixedice', './addable', './group'], function(addable, Group) {

  var Behavior = function() {
    var descriptor = arguments[0];
    var args = 2 <= arguments.length ? [].slice.call(arguments, 1) : [];
    var self = this;
    
    mixedice([this, Behavior.prototype], new EventMap());
    
    
    this.type = 'Behavior';
    this.name = this.type + "-" + (Date.now());
    this.tags = [];
    this.children = new Group();
    
    this.parent = null;
    descriptor.apply(this, args);
    
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
udefine('snowflake/game', [], function() {
  var Game = function() {
    this.scenes = {};
  };
  
  Game.prototype.add = function(name) {
    
  };
  
  Game.prototype.show = function(name) {
    
  };
  
  return Game;
});

udefine('snowflake/gameobject', ['mixedice', 'eventmap', './addable', './behavior', './group'], function(mixedice, EventMap, addable, Behavior, Group) {
  var GameObject = function() {
    mixedice([this, GameObject.prototype], new EventMap());
    
    var self = this;
    
    this.x = 0;
    this.y = 0;
    
    this.parent = null;
    
    // GameObjects
    this.children = new Group();
    
    // Behaviors
    this.behaviors = new Group();
    
    // Data models
    this.models = new Group();
    
    this.on('render', function() {
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

udefine('snowflake/scene', ['mixedice', 'eventmap', './addable', './group', './gameobject'], function(mixedice, EventMap, addable, Group, GameObject) {
  
  var Scene = function() {
    mixedice([this, Scene.prototype], new EventMap());
  };
  
  Scene.prototype.addGameObject = function() {
    
  };
  
  Scene.store = {};
  
  Scene.define = function(name, factory) {
    Scene.store[name] = factory;
  };
  
});
