import serialize from '../serialize';

var serializable = function serializable(Factory) {
  Factory.prototype.toJSON = function() {
    return serialize.toJSON(this);
  };

  Factory.prototype.toString = function() {
    return serialize.toString(this);
  };
};

export default serializable;
