import Model from './Model';
import world from './World';

describe('flockn/world', () => {
  it('is an instance of flockn/model', () => {
    expect(world).toBeInstanceOf(Model);
  });
});
