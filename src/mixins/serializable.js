import serialize from '../serialize';

const serializable = function serializable(Factory) {
  /* eslint no-param-reassign: 0 */

  Factory.prototype.toJSON = function toJSON() {
    return serialize.toJSON(this);
  };

  Factory.prototype.toString = function toString() {
    return serialize.toString(this);
  };
};

export default serializable;
