import EventMap from 'eventmap';
import Texture from './Texture';

describe('flockn/texture', () => {
  it('is a function', () => {
    expect(typeof Texture).toBe('function');
  });

  describe('constructor', () => {
    it('can be instantiated', () => {
      const texture = new Texture();

      expect(typeof texture).toBe('object');
      expect(texture).toBeInstanceOf(Texture);
    });

    it('inherits from EventMap', () => {
      const texture = new Texture();

      expect(texture).toBeInstanceOf(EventMap);
    });
  });

  it('has dimension properties', () => {
    const texture = new Texture();

    expect(typeof texture.width).toBe('number');
    expect(typeof texture.height).toBe('number');
  });
});
