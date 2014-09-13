udefine(['eventmap', 'mixedice', './graphics', './group'], function(EventMap, mixedice, Graphics, Group) {
  'use strict';

  var Base = function(type, descriptor) {
    var self = this;

    mixedice([this, Base.prototype], new EventMap());

    type = type || 'Base';

    this.type = type;
    this.name = this.type + '-' + Date.now();
    this.descriptor = descriptor;

    this.children = new Group();

    this.parent = null;

    this.trigger('constructed');
  };

  Base.prototype.call = function() {
    this.apply(arguments);
  };

  Base.prototype.apply = function(args) {
    if (this.descriptor) {
      this.descriptor.apply(this, args);
      
      this.trigger('execute');
    }
  };

  Base.extend = function(target, type, descriptor) {
    var base = new Base(type, descriptor);

    mixedice(target, base);
  };

  return Base;

});
