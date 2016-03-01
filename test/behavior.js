import { expect } from 'chai';

import Behavior from 'flockn/behavior';
import Base from 'flockn/base';

describe('flockn/behavior', () => {
  it('is a function', () => {
    expect(Behavior).to.be.a('function');
  });

  describe('constructor', () => {
    it('can be instantiated', () => {
      const behavior = new Behavior();

      expect(behavior).to.be.a('object');
      expect(behavior).to.be.an.instanceOf(Behavior);
    });

    it('inherits from Base', () => {
      const behavior = new Behavior();

      expect(behavior).to.be.an.instanceOf(Base);
    });
  });

  describe('properties', () => {
    const behavior = new Behavior();

    it('has the correct type', () => {
      expect(behavior.type).to.be.a('string');
      expect(behavior.type).to.equal('Behavior');
    });
  });
});
