import Game from './game';
import Base from './base';

describe('flockn/game', () => {
  it('is a function', () => {
    expect(typeof Game).toBe('function');
  });

  describe('constructor', () => {
    it('can be instantiated', () => {
      const game = new Game();

      expect(typeof game).toBe('object');
      expect(game).toBeInstanceOf(Game);
    });

    it('inherits from Base', () => {
      const game = new Game();

      expect(game).toBeInstanceOf(Base);
    });
  });

  describe('properties', () => {
    const game = new Game();

    it('has the correct type', () => {
      expect(typeof game.type).toBe('string');
      expect(game.type).toBe('Game');
    });
  });
});
