'use strict';

import EventMap from 'eventmap';
import Base from 'flockn/base';

describe('flockn/base', function () {

  it('is a function', function () {
    expect(Base).to.be.a('function');
  });

  describe('constructor', function () {
    it('can be instantiated', function () {
      var base = new Base();

      expect(base).to.be.a('object');
      expect(base).to.be.an.instanceOf(Base);
    });

    it('inherits from EventMap', function() {
      var base = new Base();

      expect(base).to.be.an.instanceOf(EventMap);
    })
  });

  describe('properties', function() {
    var base = new Base();

    it('has the correct type', function() {
      expect(base.type).to.be.a('string');
      expect(base.type).to.equal('Base');
    });
  });
});
