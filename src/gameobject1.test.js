import GameObject from './gameobject';
import Base from './base';

describe('flockn/gameobject', () => {
  it('is a function', () => {
    expect(typeof GameObject).toBe('function');
  });

  describe('constructor', () => {
    it('can be instantiated', () => {
      const gameObject = new GameObject();

      expect(typeof gameObject).toBe('object');
      expect(gameObject).toBeInstanceOf(GameObject);
    });

    it('inherits from Base', () => {
      const gameObject = new GameObject();

      expect(gameObject).toBeInstanceOf(Base);
    });
  });
});
