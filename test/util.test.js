var assert = require('assert');

var Util = require('../src/util').Util;

describe('Util', function() {

  describe('Util.positiveModulus', function() {

    it('should be correct for positive values', function() {
      assert.equal(Util.positiveModulus(0, 7), 0);
      assert.equal(Util.positiveModulus(1, 7), 1);
      assert.equal(Util.positiveModulus(7, 7), 0);
    });

    it('should be correct for negative values', function() {
      assert.equal(Util.positiveModulus(-1, 7), 6);
      assert.equal(Util.positiveModulus(-7, 7), 0);
    });

  });

});
