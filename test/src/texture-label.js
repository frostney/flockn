'use strict';

import TextureLabel from 'flockn/texture/label';

describe('flockn/texture/label', function () {

  it('is a function', function () {
    expect(TextureLabel).to.be.a('function');
  });

  describe('constructor', function () {
    it('can be instantiated', function () {
      var textureLabel = new TextureLabel();

      expect(textureLabel).to.be.a('object');
      expect(textureLabel).to.be.an.instanceOf(TextureLabel);
    });
  });

});
