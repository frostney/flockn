import EventMap from 'eventmap';
import Model from './model';

describe('flockn/model', () => {
  it('is a function', () => {
    expect(typeof Model).toBe('function');
  });

  describe('constructor', () => {
    it('can be instantiated', () => {
      const model = new Model();

      expect(typeof model).toBe('object');
      expect(model).toBeInstanceOf(Model);
    });

    it('inherits from EventMap', () => {
      const model = new Model();

      expect(model).toBeInstanceOf(EventMap);
    });
  });

  describe('#get', () => {
    const model = new Model();

    it('undefined when there is no valid property', () => {
      const test = model.get('test');

      expect(test).toBe(undefined);
    });

    it('exact property value', () => {
      model.set('test', 5);
      const test = model.get('test');

      expect(test).toBe(5);
    });
  });

  describe('#set', () => {
    const model = new Model();

    it('gets correctly set', () => {
      model.set('test', 8);
      const test = model.get('test');

      expect(test).toBe(8);
    });

    it('overwrites previous value', () => {
      model.set('test', 8);
      model.set('test', 12);
      const test = model.get('test');

      expect(test).toBe(12);
    });
  });
});
