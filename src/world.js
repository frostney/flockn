udefine(['eventmap'], function(EventMap) {
	var events = new EventMap();
	var World = {};
	var data = {};
	
	World.get = function(name) {
		if (Object.hasOwnProperty.call(data, name)) {
			return data[name];
		}
	};
	
	World.set = function(name, value) {
		data[name] = value;
		World.trigger('change', name, value);
	};
	
	World.on = events.on;
	World.off = events.off;
	World.before = events.before;
	World.after = events.after;
	World.trigger = events.trigger;
	
	return World;
});
