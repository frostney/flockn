import EventMap from 'eventmap';
import Base from './base';

describe('flockn/base', () => {
  it('is a function', () => {
    expect(typeof Base).toBe('function');
  });

  describe('constructor', () => {
    it('can be instantiated', () => {
      const base = new Base();

      expect(typeof base).toBe('object');
      expect(base).toBeInstanceOf(Base);
    });

    it('inherits from EventMap', () => {
      const base = new Base();

      expect(base).toBeInstanceOf(EventMap);
    });
  });

  describe('properties', () => {
    const base = new Base();

    it('has the correct type', () => {
      expect(typeof base.type).toBe('string');
      expect(base.type).toBe('Base');
    });
  });
});
