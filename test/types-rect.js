import { expect } from 'chai';

import { Rect, Vector2 } from 'flockn/types';

describe('flockn/types/rect', () => {
  it('is a function', () => {
    expect(Rect).to.be.a('function');
  });

  describe('constructor', () => {
    const rect = new Rect();

    it('can be instantiated', () => {
      expect(rect).to.be.a('object');
      expect(rect).to.be.an.instanceOf(Rect);
    });

    it('default values', () => {
      expect(rect.x).to.be.a('number');
      expect(rect.y).to.be.a('number');
      expect(rect.w).to.be.a('number');
      expect(rect.h).to.be.a('number');

      expect(rect.x).to.equal(0);
      expect(rect.y).to.equal(0);
      expect(rect.w).to.equal(0);
      expect(rect.h).to.equal(0);
    });

    it('custom values', () => {
      const rect2 = new Rect(10, 10, 50, 50);

      expect(rect2.x).to.be.a('number');
      expect(rect2.y).to.be.a('number');
      expect(rect2.w).to.be.a('number');
      expect(rect2.h).to.be.a('number');

      expect(rect2.x).to.equal(10);
      expect(rect2.y).to.equal(10);
      expect(rect2.w).to.equal(50);
      expect(rect2.h).to.equal(50);
    });
  });

  describe('#center', () => {
    const rect = new Rect();

    it('x value should return a number', () => expect(rect.center().x).to.be.a('number'));
    it('y value should return a number', () => expect(rect.center().y).to.be.a('number'));
    it('x value should be 0 if x, y, w and h are 0', () => expect(rect.center().x).to.equal(0));
    it('y value should be 0 if x, y, w and h are 0', () => expect(rect.center().y).to.equal(0));
  });

  describe('#toJSON', () => {
    const rect = new Rect();
    const rect2 = new Rect(20, 20, 40, 40);

    it('stringified empty rect', () => expect(rect.toJSON()).to.deep.equal({
      x: 0, y: 0, w: 0, h: 0,
    }));
    it('stringified custom rect', () => expect(rect2.toJSON()).to.deep.equal({
      x: 20, y: 20, w: 40, h: 40,
    }));
  });

  describe('#toString', () => {
    const rect = new Rect();
    const rect2 = new Rect(20, 20, 40, 40);

    it('stringified empty rect', () => expect(rect.toString()).to.equal(JSON.stringify({
      x: 0, y: 0, w: 0, h: 0,
    })));
    it('stringified custom rect', () => expect(rect2.toString()).to.equal(JSON.stringify({
      x: 20, y: 20, w: 40, h: 40,
    })));
  });

  describe('#contains', () => {
    const rect = new Rect(0, 0, 20, 20);
    const rect2 = new Rect(50, 50, 30, 30);
    const vector = new Vector2(10, 10);

    it('vector contained in rect', () => expect(rect.contains(vector)).to.equal(true));
    it('vector not contained in rect', () => expect(rect2.contains(vector)).to.equal(false));
  });

  describe('#center', () => {
    const rect = new Rect(10, 10, 40, 40);
    const vector = rect.center();

    it('returns a vector', () => expect(vector).to.be.an.instanceOf(Vector2));
    it('centers the rect', () => {
      expect(vector.x).to.equal(30);
      expect(vector.y).to.equal(30);
    });
  });

  describe('.fromString', () => {
    const obj = {
      x: 10, y: 10, w: 50, h: 50,
    };
    const string = JSON.stringify(obj);

    const rect = Rect.fromString(string);

    it('is a rect', () => expect(rect).to.be.an.instanceOf(Rect));
    it('has the correct values', () => {
      expect(rect.x).to.equal(10);
      expect(rect.y).to.equal(10);
      expect(rect.w).to.equal(50);
      expect(rect.h).to.equal(50);
    });
  });
});
