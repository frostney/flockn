'use strict';

import EventMap from 'eventmap';
import Model from 'flockn/model';

describe('flockn/model', function () {

  it('is a function', function () {
    expect(Model).to.be.a('function');
  });

  describe('constructor', function () {
    it('can be instantiated', function () {
      var model = new Model();

      expect(model).to.be.a('object');
      expect(model).to.be.an.instanceOf(Model);
    });

    it('inherits from EventMap', function() {
      var model = new Model();

      expect(model).to.be.an.instanceOf(EventMap);
    });
  });

  describe('#get', function() {
    it('undefined when there is no valid property', function() {
      var model = new Model();

      expect(model.get('test')).to.be(undefined);
    });

    it('exact property value', function() {
      var model = new Model();
      model.set('test', 5);

      expect(model.get('test')).to.be(5);
    });
  });

});
