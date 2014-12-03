import serialize from 'flockn/serialize';

var serializable = function serializable() {
  this.toJSON = function() {
    return serialize.toJSON(this);
  };

  this.toString = function() {
    return serialize.toString(this);
  };
};

export default serializable;
