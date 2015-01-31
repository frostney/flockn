'use strict';

import Group from 'flockn/group';

describe('flockn/group', function () {

  it('is a function', function () {
    expect(Group).to.be.a('function');
  });

  describe('constructor', function () {
    it('can be instantiated', function () {
      var group = new Group();

      expect(group).to.be.a('object');
      expect(group).to.be.an.instanceOf(Group);
    });
  });

});
