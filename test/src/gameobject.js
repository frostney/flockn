'use strict';

import GameObject from 'flockn/gameobject';
import Base from 'flockn/base';

describe('flockn/gameobject', function () {

  it('is a function', function () {
    expect(GameObject).to.be.a('function');
  });

  describe('constructor', function () {
    it('can be instantiated', function () {
      var gameObject = new GameObject();

      expect(gameObject).to.be.a('object');
      expect(gameObject).to.be.an.instanceOf(GameObject);
    });

    it('inherits from Base', function() {
      var gameObject = new GameObject();

      expect(gameObject).to.be.an.instanceOf(Base);
    });
  });

});
