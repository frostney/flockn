udefine(['./serialize'], function(serialize) {
	'use strict';
	
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
    
    Object.keys(this.tags).forEach(function(tag) {
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
  
  // TODO: Evaluate if Group#map and Group#filter should rather return a Group instance than an array
  Group.prototype.map = function(callback) {
  	var mappedArray = [];
    
    for (var i = 0; i < this.length; i++) {
      mappedArray.push(callback(this[i]));
    }
    
    return mappedArray;
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
  
  Group.prototype.toJSON = function() {
  	return serialize(this);
  };

  return Group;
});
