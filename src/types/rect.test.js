import { Rect, Vector2 } from './';

describe('flockn/types/rect', () => {
  it('is a function', () => {
    expect(typeof Rect).toBe('function');
  });

  describe('constructor', () => {
    const rect = new Rect();

    it('can be instantiated', () => {
      expect(typeof rect).toBe('object');
      expect(rect).toBeInstanceOf(Rect);
    });

    it('default values', () => {
      expect(typeof rect.x).toBe('number');
      expect(typeof rect.y).toBe('number');
      expect(typeof rect.w).toBe('number');
      expect(typeof rect.h).toBe('number');

      expect(rect.x).toBe(0);
      expect(rect.y).toBe(0);
      expect(rect.w).toBe(0);
      expect(rect.h).toBe(0);
    });

    it('custom values', () => {
      const rect2 = new Rect(10, 10, 50, 50);

      expect(typeof rect2.x).toBe('number');
      expect(typeof rect2.y).toBe('number');
      expect(typeof rect2.w).toBe('number');
      expect(typeof rect2.h).toBe('number');

      expect(rect2.x).toBe(10);
      expect(rect2.y).toBe(10);
      expect(rect2.w).toBe(50);
      expect(rect2.h).toBe(50);
    });
  });

  describe('#center', () => {
    const rect = new Rect();

    it('x value should return a number', () => expect(typeof rect.center().x).toBe('number'));
    it('y value should return a number', () => expect(typeof rect.center().y).toBe('number'));
    it('x value should be 0 if x, y, w and h are 0', () => expect(rect.center().x).toBe(0));
    it('y value should be 0 if x, y, w and h are 0', () => expect(rect.center().y).toBe(0));
  });

  describe('#toJSON', () => {
    const rect = new Rect();
    const rect2 = new Rect(20, 20, 40, 40);

    it('stringified empty rect', () =>
      expect(rect.toJSON()).toEqual({
        x: 0,
        y: 0,
        w: 0,
        h: 0,
      }));
    it('stringified custom rect', () =>
      expect(rect2.toJSON()).toEqual({
        x: 20,
        y: 20,
        w: 40,
        h: 40,
      }));
  });

  describe('#toString', () => {
    const rect = new Rect();
    const rect2 = new Rect(20, 20, 40, 40);

    it('stringified empty rect', () =>
      expect(rect.toString()).toBe(JSON.stringify({
        x: 0,
        y: 0,
        w: 0,
        h: 0,
      })));
    it('stringified custom rect', () =>
      expect(rect2.toString()).toBe(JSON.stringify({
        x: 20,
        y: 20,
        w: 40,
        h: 40,
      })));
  });

  describe('#contains', () => {
    const rect = new Rect(0, 0, 20, 20);
    const rect2 = new Rect(50, 50, 30, 30);
    const vector = new Vector2(10, 10);

    it('vector contained in rect', () => expect(rect.contains(vector)).toBe(true));
    it('vector not contained in rect', () => expect(rect2.contains(vector)).toBe(false));
  });

  describe('#center', () => {
    const rect = new Rect(10, 10, 40, 40);
    const vector = rect.center();

    it('returns a vector', () => expect(vector).toBeInstanceOf(Vector2));
    it('centers the rect', () => {
      expect(vector.x).toBe(30);
      expect(vector.y).toBe(30);
    });
  });

  describe('.fromString', () => {
    const obj = {
      x: 10,
      y: 10,
      w: 50,
      h: 50,
    };
    const string = JSON.stringify(obj);

    const rect = Rect.fromString(string);

    it('is a rect', () => expect(rect).toBeInstanceOf(Rect));
    it('has the correct values', () => {
      expect(rect.x).toBe(10);
      expect(rect.y).toBe(10);
      expect(rect.w).toBe(50);
      expect(rect.h).toBe(50);
    });
  });
});
