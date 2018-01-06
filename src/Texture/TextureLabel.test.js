import TextureLabel from './TextureLabel';

describe('flockn/texture/label', () => {
  it('is a function', () => {
    expect(typeof TextureLabel).toBe('function');
  });

  describe('constructor', () => {
    it('can be instantiated', () => {
      const textureLabel = new TextureLabel();

      expect(typeof textureLabel).toBe('object');
      expect(textureLabel).toBeInstanceOf(TextureLabel);
    });
  });
});
