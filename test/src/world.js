'use strict';

import Model from 'flockn/model';
import world from 'flockn/world';

describe('flockn/world', function () {

  it('is an instance of flockn/model', function() {
    expect(world).to.be.an.instanceOf(Model);
  });

});
