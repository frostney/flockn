import { expect } from 'chai';

import Group from 'flockn/group';
import Behavior from 'flockn/behavior';

describe('flockn/group', () => {
  it('is a function', () => {
    expect(Group).to.be.a('function');
  });

  describe('constructor', () => {
    const group = new Group();

    it('can be instantiated', () => {
      expect(group).to.be.a('object');
      expect(group).to.be.an.instanceOf(Group);
    });

    it('has default values', () => {
      expect(group.length).to.be.a('number');
      expect(group.length).to.equal(0);

      expect(group.ids).to.be.a('object');

      expect(group.tags).to.be.a('object');

      expect(group.types).to.be.a('object');
    });
  });

  describe('Using behaviors', () => {
    const group = new Group();

    it('adds behavior', () => {
      const b = new Behavior();

      group.push(b);

      expect(group.length).to.equal(1);
    });
  });
});
