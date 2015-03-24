'use strict';

import TextureImage from 'flockn/texture/image';

describe('flockn/texture/image', function () {

  it('is a function', function () {
    expect(TextureImage).to.be.a('function');
  });

  describe('constructor', function () {
    it('can be instantiated', function () {
      var textureImage = new TextureImage();

      expect(textureImage).to.be.a('object');
      expect(textureImage).to.be.an.instanceOf(TextureImage);
    });
  });

});
