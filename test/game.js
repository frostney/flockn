import { expect } from 'chai';

import Game from 'flockn/game';
import Base from 'flockn/base';

describe('flockn/game', () => {
  it('is a function', () => {
    expect(Game).to.be.a('function');
  });

  describe('constructor', () => {
    it('can be instantiated', () => {
      const game = new Game();

      expect(game).to.be.a('object');
      expect(game).to.be.an.instanceOf(Game);
    });

    it('inherits from Base', () => {
      const game = new Game();

      expect(game).to.be.an.instanceOf(Base);
    });
  });

  describe('properties', () => {
    const game = new Game();

    it('has the correct type', () => {
      expect(game.type).to.be.a('string');
      expect(game.type).to.equal('Game');
    });
  });
});
