import EventMap from 'eventmap';
import Base from 'flockn/base';

import { expect } from 'chai';

describe('flockn/base', () => {
  it('is a function', () => {
    expect(Base).to.be.a('function');
  });

  describe('constructor', () => {
    it('can be instantiated', () => {
      const base = new Base();

      expect(base).to.be.a('object');
      expect(base).to.be.an.instanceOf(Base);
    });

    it('inherits from EventMap', () => {
      const base = new Base();

      expect(base).to.be.an.instanceOf(EventMap);
    });
  });

  describe('properties', () => {
    const base = new Base();

    it('has the correct type', () => {
      expect(base.type).to.be.a('string');
      expect(base.type).to.equal('Base');
    });
  });
});
