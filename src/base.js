udefine(['eventmap', 'mixedice', './group'], function(EventMap, mixedice, Group) {
  'use strict';

  var Base = function(type) {
    var self = this;
    
    mixedice([this, Base.prototype], new EventMap());

    type = type || 'Base';

    this.type = type;
    this.name = this.type + '-' + Date.now();

    this.children = new Group();

    this.parent = null;
    
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
    });

    this.trigger('constructed');
  };

  Base.extend = function(target, type) {
    var base = new Base(type);

    mixedice(target, base);

    return {
      factory: function(args) {
        var descriptor;

        if (args) {
          descriptor = args[0];
          var argsArray = 2 <= args.length ? [].slice.call(args, 1) : [];
        }

        if (descriptor) {
          descriptor.apply(this || base, argsArray);
        }
      }
    };
  };

  return Base;

});
