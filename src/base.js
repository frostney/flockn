udefine(['eventmap', 'mixedice', 'gameboard/input', './group', './world'], function(EventMap, mixedice, Input, Group, World) {
  'use strict';
  
  var objectIndex = 0;
  
  var prependMax = 10000;
  
  var numToIdString = function(num) {
  	var stringNum = num + '';
  	
  	if (num >= prependMax) {
  		return stringNum;
  	} else {
  		var prependLength = (prependMax + '').length - stringNum.length;
  		for (var i = 0; i < prependLength; i++) {
  			stringNum = '0' + stringNum;
  		}
  		
  		return stringNum;
  	}
  };

  var Base = function(type, descriptor) {
    var self = this;

    mixedice([this, Base.prototype], new EventMap());

    type = type || 'Base';

    this.type = type;
    this.name = this.type + '-' + Date.now();
    
 		var currentObject = numToIdString(++objectIndex);
    
    Object.defineProperty(this, 'id', {
    	get: function() {
    		return this.type + '-' + currentObject;
    	},
    	enumerable: true
    });
    
    this.descriptor = descriptor;

    this.children = new Group();
    
    this.queue = [];

    this.parent = null;
    
    this.input = Input;
    
    this.world = World;
    
    this.trigger('constructed');
  };

  Base.prototype.call = Base.prototype.reset = function() {
    this.apply(arguments);
  };

  Base.prototype.apply = function(args) {
  	// TODO: Reflect if function check should be enforced here
    if (this.descriptor) {
    	
      this.descriptor.apply(this, args);
      this.trigger('execute');
      
      // TODO: Impose an order in the queue, such as:
      // (Game) -> Scene -> GameObject -> Behavior -> Model
      this.queue.forEach(function(q) {
      	q && q();
      });
      this.queue = [];
    }
  };
  
  Base.prototype.log = function() {
  	if (console && console.log) {
  		var argArray = [].slice.call(arguments);
  		
  		argArray.unshift(':');
  		argArray.unshift(this.name);
  		argArray.unshift(this.type);
  		
  		return console.log.apply(console, argArray);
  	}
  };

  Base.extend = function(target, type, descriptor) {
    var base = new Base(type, descriptor);

    mixedice(target, base);
  };

  return Base;

});