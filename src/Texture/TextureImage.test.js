import TextureImage from './TextureImage';

describe('flockn/texture/image', () => {
  it('is a function', () => {
    expect(typeof TextureImage).toBe('function');
  });

  describe('constructor', () => {
    it('can be instantiated', () => {
      const textureImage = new TextureImage();

      expect(typeof textureImage).toBe('object');
      expect(textureImage).toBeInstanceOf(TextureImage);
    });
  });
});
