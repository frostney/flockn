'use strict';

import Rect from 'flockn/types/rect';

describe('flockn/types/rect', function () {

  it('is a function', function () {
    expect(Rect).to.be.a('function');
  });

  describe('constructor', function () {
    var rect = new Rect();

    it('can be instantiated', function () {
      expect(rect).to.be.a('object');
      expect(rect).to.be.an.instanceOf(Rect);
    });

    it('default values', function() {
      expect(rect.x).to.be.a('number');
      expect(rect.y).to.be.a('number');
      expect(rect.w).to.be.a('number');
      expect(rect.h).to.be.a('number');

      expect(rect.x).to.equal(0);
      expect(rect.y).to.equal(0);
      expect(rect.w).to.equal(0);
      expect(rect.h).to.equal(0);
    });
  });

  describe('#center()', function() {
    var rect = new Rect();

    it('x value should return a number', () => expect(rect.center().x).to.be.a('number'));
    it('y value should return a number', () => expect(rect.center().y).to.be.a('number'));
    it('x value should be 0 if x, y, w and h are 0', () => expect(rect.center().x).to.equal(0));
    it('y value should be 0 if x, y, w and h are 0', () => expect(rect.center().y).to.equal(0));
  });

  describe('#toString()', function() {
    var rect = new Rect();
    var rect2 = new Rect(20, 20, 40, 40);

    it('stringified empty rect', () => expect(rect.toString()).to.equal(JSON.stringify({x: 0, y: 0, w: 0, h: 0})));
    it('stringified custom rect', () => expect(rect2.toString()).to.equal(JSON.stringify({x: 20, y: 20, w: 40, h: 40})));
  });
});
