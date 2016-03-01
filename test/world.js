import { expect } from 'chai';

import Model from 'flockn/model';
import world from 'flockn/world';

describe('flockn/world', () => {
  it('is an instance of flockn/model', () => {
    expect(world).to.be.an.instanceOf(Model);
  });
});
