import Model from './model';
import world from './world';

describe('flockn/world', () => {
  it('is an instance of flockn/model', () => {
    expect(world).toBeInstanceOf(Model);
  });
});
