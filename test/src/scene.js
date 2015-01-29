'use strict';

import Scene from 'flockn/scene';
import Base from 'flockn/base';

describe('flockn/scene', function () {

  it('is a function', function () {
    expect(Scene).to.be.a('function');
  });

  describe('constructor', function () {
    it('can be instantiated', function () {
      var scene = new Scene();

      expect(scene).to.be.a('object');
      expect(scene).to.be.an.instanceOf(Scene);
    });

    it('inherits from Base', function() {
      var scene = new Scene();

      expect(scene).to.be.an.instanceOf(Scene);
    });
  });

  describe('properties', function() {
    var scene = new Scene();

    it('has the correct type', function() {
      expect(scene.type).to.be.a('string');
      expect(scene.type).to.equal('Base');
    });
  });
});
