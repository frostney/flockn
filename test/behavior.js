'use strict';

import Behavior from 'flockn/behavior';
import Base from 'flockn/base';

describe('flockn/behavior', function () {

  it('is a function', function () {
    expect(Behavior).to.be.a('function');
  });

  describe('constructor', function () {
    it('can be instantiated', function () {
      var behavior = new Behavior();

      expect(behavior).to.be.a('object');
      expect(behavior).to.be.an.instanceOf(Behavior);
    });

    it('inherits from Base', function() {
      var behavior = new Behavior();

      expect(behavior).to.be.an.instanceOf(Base);
    });
  });

  describe('properties', function() {
    var behavior = new Behavior();

    it('has the correct type', function() {
      expect(behavior.type).to.be.a('string');
      expect(behavior.type).to.equal('Behavior');
    });
  });

  describe('Define behaviors', function() {
    it('property exists', function() {
      expect(Behavior.define).to.be.a('function');
    });

    it('store exists', function() {
      expect(Behavior.store).to.be.a('object');
    });
  });
});
