import { expect } from 'chai';

import GameObject from 'flockn/gameobject';
import Base from 'flockn/base';

describe('flockn/gameobject', () => {
  it('is a function', () => {
    expect(GameObject).to.be.a('function');
  });

  describe('constructor', () => {
    it('can be instantiated', () => {
      const gameObject = new GameObject();

      expect(gameObject).to.be.a('object');
      expect(gameObject).to.be.an.instanceOf(GameObject);
    });

    it('inherits from Base', () => {
      const gameObject = new GameObject();

      expect(gameObject).to.be.an.instanceOf(Base);
    });
  });
});
