'use strict';

import EventMap from 'eventmap';
import Texture from 'flockn/texture';

describe('flockn/texture', function () {

  it('is a function', function () {
    expect(Texture).to.be.a('function');
  });

  describe('constructor', function () {
    it('can be instantiated', function () {
      var texture = new Texture();

      expect(texture).to.be.a('object');
      expect(texture).to.be.an.instanceOf(Texture);
    });

    it('inherits from EventMap', function() {
      var texture = new Texture();

      expect(texture).to.be.an.instanceOf(EventMap);
    });
  });

  it('has dimension properties', function() {
    var texture = new Texture();

    expect(texture.width).to.be.a('number');
    expect(texture.height).to.be.a('number');
  });

});
