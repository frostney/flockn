import Behavior from './Behavior';
import Base from './Base';

describe('flockn/behavior', () => {
  it('is a function', () => {
    expect(typeof Behavior).toBe('function');
  });

  describe('constructor', () => {
    it('can be instantiated', () => {
      const behavior = new Behavior();

      expect(typeof behavior).toBe('object');
      expect(behavior).toBeInstanceOf(Behavior);
    });

    it('inherits from Base', () => {
      const behavior = new Behavior();

      expect(behavior).toBeInstanceOf(Base);
    });
  });

  describe('properties', () => {
    const behavior = new Behavior();

    it('has the correct type', () => {
      expect(typeof behavior.type).toBe('string');
      expect(behavior.type).toBe('Behavior');
    });
  });
});
