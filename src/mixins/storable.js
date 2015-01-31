var storable = function(Factory) {
  Factory.store = {};

  Factory.define = function(name, factory) {
    if (Factory[store][name]) {
      throw new Error(`${name} does already exist.`);
    } else {
      Factory[store][name] = factory;
    }
  };
};

export default storable;
