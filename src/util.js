'use strict';

var Util = {};

Util.addErrorTypes = function(classConstructor, className, errorNames) {
  errorNames.forEach(function(errorName) {
    classConstructor[errorName] = function(message) {
      this.name = className + '.' + errorName;
      this.message = message || "";
    }
    classConstructor[errorName].prototype = Error.prototype;
  });
}

Util.positiveModulus = function(a, n) {
  return ((a % n) + n) % n;
}

module.exports.Util = Util;
