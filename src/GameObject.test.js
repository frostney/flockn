import GameObject from './GameObject';
import Base from './Base';

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
