udefine(['mixedice', 'eventmap'], function(mixedice, EventMap) {
  'use strict';

  var Texture = function() {
    mixedice([this, Texture.prototype], new EventMap());

    var self = this;

    this.width = 0;
    this.height = 0;

    this.parent = null;

    this.image = {
      color: 'rgb(255, 255, 255)',
      offset: {
        x: 0,
        y: 0
      },
      data: null,
      width: 0,
      height: 0
    };

    var filename = '';

    Object.defineProperty(this.image, 'filename', {
      get: function() {
        return filename;
      },
      set: function(value) {
        filename = value;

        // TODO: Most of this should already be handled by the preloader
        var img = new Image();
        img.src = filename;

        img.onload = function() {
          self.image.data = img;
          self.image.width = img.width;
          self.image.height = img.height;

          self.trigger('image-loaded');
        };
      },
      enumerable: true
    });

    this.label = {
      font: {
        size: 10,
        name: 'Arial',
        color: 'rgb(0, 0, 0)',
        decoration: []
      },
      align: {
        x: 'center',
        y: 'center'
      },
      width: 0,
      height: 0
    };

    var text = '';

    Object.defineProperty(this.label, 'text', {
      get: function() {
        return text;
      },
      set: function(value) {
        text = value;

        // TODO: This should be handled somewhere else, but I'm not sure where
        var tmpElem = document.createElement('div');
        tmpElem.innerText = text;
        tmpElem.style.position = 'absolute';
        tmpElem.style.left = '-9999px';
        tmpElem.style.top = '-9999px';
        tmpElem.style.fontSize = self.label.font.size + 'px';
        tmpElem.style.fontFamily = self.label.font.name;
        tmpElem.style.color = self.label.font.color;
        
        self.label.font.decoration.forEach(function(decoration) {
          switch (decoration) {
            case 'bold':
              tmpElem.style.fontWeight = 'bold';
              break;
            case 'italic':
              tmpElem.style.fontStyle = 'italic';
              break;
            case 'underline':
              tmpElem.style.textDecoration = 'underline';
              break;
            default:
              break;
          }
        });
        
        document.body.appendChild(tmpElem);
        
        self.label.width = tmpElem.clientWidth;
        self.label.height = tmpElem.clientHeight;
        
        document.body.removeChild(tmpElem);

        self.trigger('label-loaded');
      }
    });

    this.color = 'transparent';

  };

  return Texture;
});
