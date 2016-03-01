import { expect } from 'chai';

import TextureLabel from 'flockn/texture/label';

describe('flockn/texture/label', () => {
  it('is a function', () => {
    expect(TextureLabel).to.be.a('function');
  });

  describe('constructor', () => {
    it('can be instantiated', () => {
      const textureLabel = new TextureLabel();

      expect(textureLabel).to.be.a('object');
      expect(textureLabel).to.be.an.instanceOf(TextureLabel);
    });
  });
});
