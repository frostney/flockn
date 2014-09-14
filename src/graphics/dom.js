udefine(['../graphics'], function(Graphics) {
	
	Graphics.init = function(container) {
		Graphics.renderer = 'DOM';
		
		if (container.indexOf('#') === 0) {
			container = container.slSice(1);
		}
		
		Graphics.container = container;
		Graphics.element = document.getElementById(container);
		
		if (Graphics.element == null) {
			var element = document.createElement('div');
			element.id = container;
			document.body.appendChild(element);
			
			Graphics.element = element;
		}
	};
	
	Graphics.on('create', function(type, obj) {
		switch (type) {
			case 'Scene':
				var element = document.createElement('div');
				element.id = obj.name;
				Graphics.element.appendChild(element);
				break;
			case 'GameObject':
				var element = document.createElement('div');
				var parentElement = document.getElementById(obj.parent.name);
				element.id = obj.name;
				element.style.position = 'absolute';
				element.style.left = obj.x + 'px';
				element.style.top = obj.y + 'px';
				parentElement.appendChild(element);
				break;
			default:
				break;
		}
	});
	
	Graphics.on('render', function(type, obj) {
		
		switch (type) {
			case 'GameObject':
				break;
			default:
				break;
		}
		
	});
	
	return Graphics;
	
});
