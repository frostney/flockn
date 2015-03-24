'use strict';

import Group from 'flockn/group';
import Behavior from 'flockn/behavior';

describe('flockn/group', function () {

  it('is a function', function () {
    expect(Group).to.be.a('function');
  });

  describe('constructor', function () {
    var group = new Group();

    it('can be instantiated', function () {
      expect(group).to.be.a('object');
      expect(group).to.be.an.instanceOf(Group);
    });

    it('has default values', function() {
      expect(group.length).to.be.a('number');
      expect(group.length).to.equal(0);

      expect(group.ids).to.be.a('object');

      expect(group.tags).to.be.a('object');

      expect(group.types).to.be.a('object');
    });
  });

  describe('Using behaviors', function() {
    var group = new Group();

    it('adds behavior', function() {
      var b = new Behavior();

      group.push(b);

      expect(group.length).to.equal(1);
    });
  });

});
