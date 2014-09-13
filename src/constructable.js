udefine(function() {
	return function(constructor, type, args) {
		var argArray = (Array.isArray(args)) ? args : [].slice.call(args);
		
		// TODO: Somehow the bind.apply combination kills an argument, so we add one in
		// before it's property fixed
		argArray.unshift(constructor);
		
		argArray.unshift(type);
		var Factory = constructor.bind.apply(constructor, argArray);
		return new Factory();
	};
});
