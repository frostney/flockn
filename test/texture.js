import { expect } from 'chai';

import EventMap from 'eventmap';
import Texture from 'flockn/texture';

describe('flockn/texture', () => {
  it('is a function', () => {
    expect(Texture).to.be.a('function');
  });

  describe('constructor', () => {
    it('can be instantiated', () => {
      const texture = new Texture();

      expect(texture).to.be.a('object');
      expect(texture).to.be.an.instanceOf(Texture);
    });

    it('inherits from EventMap', () => {
      const texture = new Texture();

      expect(texture).to.be.an.instanceOf(EventMap);
    });
  });

  it('has dimension properties', () => {
    const texture = new Texture();

    expect(texture.width).to.be.a('number');
    expect(texture.height).to.be.a('number');
  });
});
