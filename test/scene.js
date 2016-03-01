import { expect } from 'chai';

import Scene from 'flockn/scene';
import Base from 'flockn/base';

describe('flockn/scene', () => {
  it('is a function', () => {
    expect(Scene).to.be.a('function');
  });

  describe('constructor', () => {
    it('can be instantiated', () => {
      const scene = new Scene();

      expect(scene).to.be.a('object');
      expect(scene).to.be.an.instanceOf(Scene);
    });

    it('inherits from Base', function() {
      const scene = new Scene();

      expect(scene).to.be.an.instanceOf(Base);
    });
  });

  describe('properties', () => {
    const scene = new Scene();

    it('has the correct type', () => {
      expect(scene.type).to.be.a('string');
      expect(scene.type).to.equal('Scene');
    });
  });
});
