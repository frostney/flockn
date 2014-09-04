udefine(['../graphics'], function(Graphics) {
	
	Graphics.init = function(container) {
		Graphics.renderer = 'DOM';
		Graphics.container = container;
	};
	
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
