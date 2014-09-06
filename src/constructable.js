udefine(function() {
	return function(constructor, type, args) {
		var argArray = [].splice.call(arguments);
		
		argArray.unshift(type);
		var Factory = constructor.bind.apply(constructor, argArray);
		return new Factory();
	};
});
