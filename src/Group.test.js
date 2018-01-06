import Group from './Group';
import Behavior from './Behavior';

describe('flockn/group', () => {
  it('is a function', () => {
    expect(typeof Group).toBe('function');
  });

  describe('constructor', () => {
    const group = new Group();

    it('can be instantiated', () => {
      expect(typeof group).toBe('object');
      expect(group).toBeInstanceOf(Group);
    });

    it('has default values', () => {
      expect(typeof group.length).toBe('number');
      expect(group).toHaveLength(0);

      expect(typeof group.ids).toBe('object');

      expect(typeof group.tags).toBe('object');

      expect(typeof group.types).toBe('object');
    });
  });

  describe('Using behaviors', () => {
    const group = new Group();

    it('adds behavior', () => {
      const b = new Behavior();

      group.push(b);

      expect(group).toHaveLength(1);
    });
  });
});
