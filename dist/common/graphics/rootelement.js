'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var createRootElement = function createRootElement(elementName, extraFn) {
  // Sets the container name: If none is given, set the id of the object.
  // If a `#` is prepended to the string, cut it off
  var containerName = (function () {
    if (this.container == null) {
      this.container = this.id;
      return this.container;
    } else {
      if (this.container.indexOf('#') === 0) {
        return this.container.slice(1);
      }
    }
  }).call(this);

  // Set the dimensions of the object. If none are given, it should be the inside of the browser's window
  this.width = this.width || window.innerWidth;
  this.height = this.height || window.innerHeight;

  // Try to get the HTML element by using `containerName`
  var rootElement = document.getElementById(containerName);

  // If nothing was found, create the element
  if (rootElement == null) {
    var element = document.createElement(elementName);
    element.id = containerName.toLowerCase();
    document.body.appendChild(element);

    rootElement = element;
  }

  rootElement.className = [this.type.toLowerCase(), this.name.toLowerCase()].join(' ');

  // Set the dimensions of the `rootElement`
  rootElement.style.position = 'absolute';
  rootElement.style.width = this.width + 'px';
  rootElement.style.height = this.height + 'px';

  // Allow some extra functionality to happen here.
  // It should be called on the same context and the
  // `rootElement` is passed in as a parameter
  extraFn.call(this, rootElement);

  // Center the element if it's smaller than the inside of the browser's window
  if (this.width < window.innerWidth) {
    rootElement.style.left = '50%';
    rootElement.style.marginLeft = this.width * -0.5 + 'px';
  }

  if (this.height < window.innerHeight) {
    rootElement.style.top = '50%';
    rootElement.style.marginTop = this.width * -0.5 + 'px';
  }

  // Return the element, in case someone wants to meddle with it
  return rootElement;
};

exports['default'] = createRootElement;
module.exports = exports['default'];
//# sourceMappingURL=rootelement.js.map