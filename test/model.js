import { expect } from 'chai';

import EventMap from 'eventmap';
import Model from 'flockn/model';

describe('flockn/model', () => {
  it('is a function', () => {
    expect(Model).to.be.a('function');
  });

  describe('constructor', () => {
    it('can be instantiated', () => {
      const model = new Model();

      expect(model).to.be.a('object');
      expect(model).to.be.an.instanceOf(Model);
    });

    it('inherits from EventMap', () => {
      const model = new Model();

      expect(model).to.be.an.instanceOf(EventMap);
    });
  });

  describe('#get', () => {
    const model = new Model();

    it('undefined when there is no valid property', () => {
      const test = model.get('test');

      expect(test).to.equal(undefined);
    });

    it('exact property value', () => {
      model.set('test', 5);
      const test = model.get('test');

      expect(test).to.equal(5);
    });
  });

  describe('#set', () => {
    const model = new Model();

    it('gets correctly set', () => {
      model.set('test', 8);
      const test = model.get('test');

      expect(test).to.equal(8);
    });

    it('overwrites previous value', () => {
      model.set('test', 8);
      model.set('test', 12);
      const test = model.get('test');

      expect(test).to.equal(12);
    });
  });
});
