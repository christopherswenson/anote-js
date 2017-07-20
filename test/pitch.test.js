var assert = require('assert');

var Pitch = require('../src/pitch').Pitch;
var Interval = require('../src/interval').Interval;
var TuningSystem = require('../src/tuning_system').TuningSystem;

describe('Pitch', function() {

  describe('Pitch.create', function() {

  });

  describe('Pitch.toFrequency', function() {

    var et = TuningSystem.EqualTemperament;

    it('works when using TuningSystem.EqualTemperament', function() {
      assert.equal(Math.round(Pitch.ANatural4.toFrequency(et)), 440);
      assert.equal(Math.round(Pitch.ANatural3.toFrequency(et)), 220);
      assert.equal(Math.round(Pitch.ANatural5.toFrequency(et)), 880);

      assert.equal(Math.round(Pitch.CNatural4.toFrequency(et)), 262);
      assert.equal(Math.round(Pitch.DNatural4.toFrequency(et)), 294);
      assert.equal(Math.round(Pitch.FSharp1.toFrequency(et)), 46);
    });

    var pt = TuningSystem.PythagoreanTuning;

    it('works when using TuningSystem.PythagoreanTuning', function() {
      [
        {pitch: Pitch.ANatural3, hz: 216},
        {pitch: Pitch.ASharp3,   hz: 231},
        {pitch: Pitch.BNatural3, hz: 243},
        {pitch: Pitch.CNatural4, hz: 256},
        {pitch: Pitch.CSharp4,   hz: 273},
        {pitch: Pitch.DNatural4, hz: 288},
        {pitch: Pitch.EFlat4,    hz: 303},
        {pitch: Pitch.DSharp4,   hz: 308},
        {pitch: Pitch.ENatural4, hz: 324},
        {pitch: Pitch.FNatural4, hz: 341},
        {pitch: Pitch.FSharp4,   hz: 365},
        {pitch: Pitch.GNatural4, hz: 384},
        {pitch: Pitch.AFlat4,    hz: 405},
        {pitch: Pitch.GSharp4,   hz: 410},
        {pitch: Pitch.ANatural4, hz: 432},
        {pitch: Pitch.BFlat4,    hz: 455},
      ].forEach(function(testCase) {
        assert.equal(Math.round(testCase.pitch.toFrequency(pt)), testCase.hz);
      });
    });

  });

  describe('Pitch.isAbove', function() {

    it('returns true when pitch is above argument', function() {
      assert(Pitch.ANatural4.isAbove(Pitch.ANatural3));
      assert(Pitch.ASharp4.isAbove(Pitch.ANatural4));
      assert(Pitch.BDoubleSharp4.isAbove(Pitch.CNatural4));
    });

    it('returns false when pitch is equal', function() {
      assert(!Pitch.ANatural4.isAbove(Pitch.ANatural4));
    });

    it('returns false when pitch is enharmonic', function() {
      assert(!Pitch.ASharp4.isAbove(Pitch.BFlat4));
      assert(!Pitch.BDoubleSharp3.isAbove(Pitch.CSharp4));
    });

  });

  describe('Pitch.isBelow', function() {

    it('returns true when pitch is below argument', function() {
      assert(Pitch.ANatural3.isBelow(Pitch.ANatural4));
      assert(Pitch.ANatural4.isBelow(Pitch.ASharp4));
      assert(Pitch.CNatural4.isBelow(Pitch.BDoubleSharp4));
    });

    it('returns false when pitch is equal', function() {
      assert(!Pitch.ANatural4.isBelow(Pitch.ANatural4));
    });

    it('returns false when pitch is enharmonic', function() {
      assert(!Pitch.BFlat4.isBelow(Pitch.ASharp4));
      assert(!Pitch.CSharp4.isBelow(Pitch.BDoubleSharp3));
    });

  });

  describe('Pitch.Octave', function() {
    it('should reject noninteger octave number', function() {
      assert.throws(function() {
        new Pitch.Octave(1.5);
      });
      assert.throws(function() {
        new Pitch.Octave("1");
      });
      assert.throws(function() {
        new Pitch.Octave(NaN);
      });
      assert.throws(function() {
        new Pitch.Octave(Infinity);
      });
      assert.throws(function() {
        new Pitch.Octave(-Infinity);
      });
    });

    it('should accept a negative octave number', function() {
      new Pitch.Octave(-1);
    });
  });

});
