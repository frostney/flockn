const checkForFlag = function checkForFlag(property) {
  return function flagCheck(initialObj) {
    const obj = initialObj || this;

    const hasFlag = Object.hasOwnProperty.call(obj, property);

    if (hasFlag) {
      return obj[property];
    }

    return true;
  };
};

export default checkForFlag;
