udefine(function() {
	'use strict';
	
	return function(elementName, extraFn) {
		var containerName = (function() {
	  	if (this.container == null) {
	  		return this.container = this.id;
	  	} else {
		  	if (this.container.indexOf('#') === 0) {
		      return this.container.slice(1);
		    }
	  	}
  	}).call(this);

    this.width = this.width || window.innerWidth;
    this.height = this.height || window.innerHeight;

    var rootElement = document.getElementById(containerName);

    if (rootElement == null) {
      var element = document.createElement(elementName);
      element.id = containerName.toLowerCase();
      document.body.appendChild(element);

      rootElement = element;
    }
   	
   	rootElement.className = [this.type.toLowerCase(), this.name.toLowerCase()].join(' ');

		rootElement.style.position = 'absolute';
    rootElement.style.width = this.width + 'px';
    rootElement.style.height = this.height + 'px';
    
    extraFn.call(this, rootElement);
    
    if (this.width < window.innerWidth) {
    	rootElement.style.left = '50%';
    	rootElement.style.marginLeft = (this.width * (-0.5)) + 'px';
    }
    
    if (this.height < window.innerHeight) {
    	rootElement.style.top = '50%';
    	rootElement.style.marginTop = (this.width * (-0.5)) + 'px';
    }
    
    return rootElement;
	};
});
