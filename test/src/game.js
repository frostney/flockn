'use strict';

import Game from 'flockn/game';

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

  });

});
