'use strict';

import Game from 'flockn/game';
import Base from 'flockn/base';

describe('flockn/game', function () {

  it('is a function', function () {
    expect(Game).to.be.a('function');
  });

  describe('constructor', function () {
    it('can be instantiated', function () {
      var game = new Game();

      expect(game).to.be.a('object');
      expect(game).to.be.an.instanceOf(Game);
    });

    it('inherits from Base', function() {
      var game = new Game();

      expect(game).to.be.an.instanceOf(Base);
    });

    it('new is optional', function() {
      var game = Game();

      expect(game).to.be.a('object');
      expect(game).to.be.an.instanceOf(Game);
    });
  });

});
