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
    var model = new Model();

    it('undefined when there is no valid property', function() {
      var test = model.get('test');

      expect(test).to.equal(undefined);
    });

    it('exact property value', function() {
      model.set('test', 5);
      var test = model.get('test');

      expect(test).to.equal(5);
    });
  });

  describe('#set', function() {
    var model = new Model();

    it('gets correctly set', function() {
      model.set('test', 8);
      var test = model.get('test');

      expect(test).to.equal(8);
    });

    it('overwrites previous value', function() {
      model.set('test', 8);
      model.set('test', 12);
      var test = model.get('test');

      expect(test).to.equal(12);
    });
  });

});
