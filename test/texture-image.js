import { expect } from 'chai';

import TextureImage from 'flockn/texture/image';

describe('flockn/texture/image', () => {
  it('is a function', () => {
    expect(TextureImage).to.be.a('function');
  });

  describe('constructor', () => {
    it('can be instantiated', () => {
      const textureImage = new TextureImage();

      expect(textureImage).to.be.a('object');
      expect(textureImage).to.be.an.instanceOf(TextureImage);
    });
  });
});
