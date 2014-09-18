udefine(['mixedice', 'eventmap'], function(mixedice, EventMap) {
	'use strict';
	
	var Model = function() {
		mixedice([this, Model.prototype], new EventMap());
		
		this.data = {};
	};
	
	Model.prototype.get = function(name) {
		if (Object.hasOwnProperty.call(this.data, name)) {
			return this.data[name];
		}
	};
	
	Model.prototype.set = function(name, value) {
		this.data[name] = value;
		this.trigger('change', name, value);
	};
	
	return Model;
	
});
