udefine([], function() {
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