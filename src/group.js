udefine(['./serialize'], function(serialize) {
  'use strict';

  var unidentified = 'untitled';
  var unidentifiedCounter = 0;

  var Group = function() {
    this.length = 0;

    this.tags = {};
    this.names = {};
    this.types = {};
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

    Object.keys(this.tags).forEach(function(tag) {
      this.tags[tag] = this.tags[tag] || [];
      this.tags[tag].push(this.length);
    }, this);

    this.names[name] = this.length;
    
    if (obj.type != null) {
    	this.types[obj.type] = this.types[obj.type] || [];
    	this.types[obj.type].push(this.length);
    }

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

  Group.prototype.map = function(callback) {
    var mappedArray = new Group();

    for (var i = 0; i < this.length; i++) {
      mappedArray.push(callback(this[i]));
    }

    return mappedArray;
  };

  Group.prototype.filter = function(callback) {
    var filteredArray = new Group();

    for (var i = 0; i < this.length; i++) {
      if (callback(this[i])) {
        filteredArray.push(this[i]);
      }
    }

    return filteredArray;
  };

  Group.prototype.byType = function(type) {
    return this.types[type].map(function(index) {
      return this[index];
    }, this);
  };

  Group.prototype.byName = function(name) {
    return this[this.names[name]];
  };

  Group.prototype.byTag = function(tag) {
    return this.tags[tag].map(function(index) {
      return this[index];
    }, this);
  };
  
  Group.prototype.select = function(selector) {
  	
  };

  Group.prototype.toJSON = function() {
    return serialize(this);
  };
  
  Group.prototype.remove = function(index) {
    var name = this[index].name;
    var tags = this[index].tags;
    
    delete this.names[name];
    
    
    delete this[index];
    
    /*for (var i = index, i < this.length; i++) {
      this[]
    }*/
    
    this.length--;
  };
  
  Group.prototype.removeByName = function(name) {
    
  };
  
  Group.prototype.removeByTag = function(tags) {
    if (!Array.isArray(tags)) {
      tags = [tags];
    }
    
  };

  return Group;
});
