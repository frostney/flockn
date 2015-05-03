import Graphics from '../graphics';

var addable = function addable(Factory, groupInstance, extraFn) {

  var adder = function adder(child, ...args) {

    // I have decided against letting anything other through than functions and instance references
    // I feel that it more complexity than it tried to solve and I had to handle some edge cases
    // and more thorough type checking

    if (!( child instanceof Factory)) {
      if (typeof child !== 'function') {
        throw new Error('A child has to be a function');
      }

      child = new Factory(child);
    }
       
    groupInstance.push(child);
    child.parent = this;

    if (extraFn) {
      extraFn.call(this, child);
    }

    Graphics.trigger('add', child);

    // Only call apply if it's available. Models for example don't have one
    if (child.apply) {
      child.apply(args);
    }

    child.trigger('add', child, args);
  };

  return function() {
    var args = [].slice.call(arguments);
    args.unshift(this);

    return adder.bind.apply(adder, args);
  };

};

export default addable;
