udefine(['mixedice', 'eventmap'], function(mixedice, EventMap) {
	'use strict';
	
	var Texture = function() {
		mixedice([this, Texture.prototype], new EventMap());
		
		var self = this;
		
		var filename = '';
		
		this.width = 0;
		this.height = 0;
		
		this.data = null;
		
		this.parent = null;
		
		this.offset = {
			x: 0,
			y: 0
		};
		
		Object.defineProperty(this, 'filename', {
			get: function() {
				return filename;
			},
			set: function(value) {
				filename = value;
				
				// TODO: Most of this should already be handled by the preloader
				var img = new Image();
				img.src = filename;
				
				img.onload = function() {
					self.data = img;
					self.trigger('loaded');
				};
			},
			enumerable: true
		});
		
		this.color = 'rgb(255, 255, 255)';
		
	};
	
	return Texture;
});
