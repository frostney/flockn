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

});
