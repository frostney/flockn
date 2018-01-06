import Scene from './Scene';
import Base from './Base';

describe('flockn/scene', () => {
  it('is a function', () => {
    expect(typeof Scene).toBe('function');
  });

  describe('constructor', () => {
    it('can be instantiated', () => {
      const scene = new Scene();

      expect(typeof scene).toBe('object');
      expect(scene).toBeInstanceOf(Scene);
    });

    it('inherits from Base', () => {
      const scene = new Scene();

      expect(scene).toBeInstanceOf(Base);
    });
  });

  describe('properties', () => {
    const scene = new Scene();

    it('has the correct type', () => {
      expect(typeof scene.type).toBe('string');
      expect(scene.type).toBe('Scene');
    });
  });
});
