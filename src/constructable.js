udefine(function() {
	return function(constructor, type, args) {
		var argArray = (Array.isArray(args)) ? args : [].slice.call(args);
		
		argArray.unshift(type);
		var Factory = constructor.bind.apply(constructor, argArray);
		return new Factory();
	};
});
