var assert = require('assert');

var Pitch = require('../src/pitch').Pitch;
var Interval = require('../src/interval').Interval;
var TuningSystem = require('../src/tuning_system').TuningSystem;

describe('Pitch', function() {

  describe('Pitch.create', function() {

    it('should produce a Pitch with equal name, accidental, and octave', function() {
      [
        { name: Pitch.Name.A, accidental: Pitch.Accidental.Natural,    octave: Pitch.Octave.withNumber(3)   },
        { name: Pitch.Name.B, accidental: Pitch.Accidental.Sharp,      octave: Pitch.Octave.withNumber(-10) },
        { name: Pitch.Name.C, accidental: Pitch.Accidental.DoubleFlat, octave: Pitch.Octave.withNumber(15)  },
      ].forEach(function(testCase) {
        var pitch = Pitch.create(testCase.name, testCase.accidental, testCase.octave);
        assert(pitch.name.isEqualTo(testCase.name))
        assert(pitch.accidental.isEqualTo(testCase.accidental))
        assert(pitch.octave.isEqualTo(testCase.octave))
      });
    });

  });

  describe('Pitch.chromaticIndex', function() {

    it('should be correct within octave', function() {
      [
        { pitch: Pitch.CNatural4,     chromaticIndex: 0  },
        { pitch: Pitch.ASharp5,       chromaticIndex: 10 },
        { pitch: Pitch.BFlat6,        chromaticIndex: 10  },
        { pitch: Pitch.DDoubleSharp8, chromaticIndex: 4  },
      ].forEach(function(testCase) {
        assert.equal(testCase.pitch.chromaticIndex, testCase.chromaticIndex);
      });
    });

    it('should be correct crossing octave boundaries', function() {
      [
        { pitch: Pitch.CFlat4,        chromaticIndex: 11 },
        { pitch: Pitch.CDoubleFlat5,  chromaticIndex: 10  },
        { pitch: Pitch.BSharp6,       chromaticIndex: 0  },
        { pitch: Pitch.BDoubleSharp8, chromaticIndex: 1  },
      ].forEach(function(testCase) {
        assert.equal(testCase.pitch.chromaticIndex, testCase.chromaticIndex);
      });
    });

    it('should be equal regardless of octave', function() {
      assert.equal(
        Pitch.CNatural4.chromaticIndex,
        Pitch.CNatural8.chromaticIndex,
        Pitch.CNatural0.chromaticIndex
      )
    });

  });

  describe('Pitch.scalarIndex', function() {

    it('should be correct', function() {
      [
        { pitch: Pitch.CNatural4,     scalarIndex: 0  },
        { pitch: Pitch.DSharp5,       scalarIndex: 1 },
        { pitch: Pitch.BFlat6,        scalarIndex: 6  },
      ].forEach(function(testCase) {
        assert.equal(testCase.pitch.scalarIndex, testCase.scalarIndex);
      });
    });

    it('should be equal regardless of octave', function() {
      assert.equal(
        Pitch.CNatural4.scalarIndex,
        Pitch.CNatural8.scalarIndex,
        Pitch.CNatural0.scalarIndex
      )
    });

  });

  describe('Pitch.isEqualTo', function() {

    it('should return true for identical pitches', function() {
      assert(Pitch.CNatural4.isEqualTo(Pitch.CNatural4));
      assert(Pitch.BDoubleFlat5.isEqualTo(Pitch.BDoubleFlat5));
    });

    it('should return true for equal pitches', function() {
      var CNatural4 = Pitch.create(Pitch.Name.C, Pitch.Accidental.Natural, Pitch.Octave.withNumber(4));
      assert(Pitch.CNatural4.isEqualTo(CNatural4));
    });

    it('should return false for enharmonic pitches', function() {
      assert(!Pitch.CSharp4.isEqualTo(Pitch.DFlat4));
      assert(!Pitch.BDoubleFlat5.isEqualTo(Pitch.ANatural5));
    });

    it('should return false for pitches with a different octave', function() {
      assert(!Pitch.CNatural4.isEqualTo(Pitch.CNatural5));
      assert(!Pitch.BDoubleFlat5.isEqualTo(Pitch.BDoubleFlat0));
    });

    it('should return false for pitches with the same name but different accidental', function() {
      assert(!Pitch.CNatural4.isEqualTo(Pitch.CSharp4));
      assert(!Pitch.BDoubleFlat5.isEqualTo(Pitch.BDoubleSharp5));
    });

  });

  describe('Pitch.isEnharmonicTo', function() {

    it('should return true for identical pitches', function() {
      assert(Pitch.CNatural4.isEnharmonicTo(Pitch.CNatural4));
      assert(Pitch.BDoubleFlat5.isEnharmonicTo(Pitch.BDoubleFlat5));
    });

    it('should return true for equal pitches', function() {
      var CNatural4 = Pitch.create(Pitch.Name.C, Pitch.Accidental.Natural, Pitch.Octave.withNumber(4));
      assert(Pitch.CNatural4.isEnharmonicTo(CNatural4));
    });

    it('should return true for enharmonic pitches', function() {
      assert(Pitch.CSharp4.isEnharmonicTo(Pitch.DFlat4));
      assert(Pitch.BDoubleFlat5.isEnharmonicTo(Pitch.ANatural5));
    });

    it('should return false for pitches with a different octave', function() {
      assert(!Pitch.CSharp4.isEnharmonicTo(Pitch.DFlat5));
      assert(!Pitch.BDoubleFlat5.isEnharmonicTo(Pitch.ANatural4));
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

  describe('Pitch.isOctaveOf', function() {

    it('should return true for identical pitches', function() {
      assert(Pitch.CNatural4.isOctaveOf(Pitch.CNatural4));
      assert(Pitch.BDoubleFlat5.isOctaveOf(Pitch.BDoubleFlat5));
    });

    it('should return true for equal pitches', function() {
      var CNatural4 = Pitch.create(Pitch.Name.C, Pitch.Accidental.Natural, Pitch.Octave.withNumber(4));
      assert(Pitch.CNatural4.isOctaveOf(CNatural4));
    });

    it('should return true for pitches with a different octave', function() {
      assert(Pitch.CNatural4.isOctaveOf(Pitch.CNatural5));
      assert(Pitch.BDoubleFlat5.isOctaveOf(Pitch.BDoubleFlat0));
    });

    it('should return false for enharmonic', function() {
      assert(!Pitch.CSharp4.isOctaveOf(Pitch.DFlat4));
      assert(!Pitch.BDoubleFlat5.isOctaveOf(Pitch.ANatural5));
      assert(!Pitch.CSharp4.isOctaveOf(Pitch.DFlat5));
      assert(!Pitch.BDoubleFlat5.isOctaveOf(Pitch.ANatural4));
    });

    it('should return false for pitches with the same name but different accidental', function() {
      assert(!Pitch.CNatural4.isOctaveOf(Pitch.CSharp4));
      assert(!Pitch.CNatural4.isOctaveOf(Pitch.CSharp5));
      assert(!Pitch.BDoubleFlat5.isOctaveOf(Pitch.BDoubleSharp5));
      assert(!Pitch.BDoubleFlat3.isOctaveOf(Pitch.BDoubleSharp5));
    });

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

  describe('Pitch.Octave.withNumber', function() {
    it('should reject noninteger octave number', function() {
      assert.throws(function() {
        Pitch.Octave.withNumber(1.5);
      });
      assert.throws(function() {
        Pitch.Octave.withNumber("1");
      });
      assert.throws(function() {
        Pitch.Octave.withNumber(NaN);
      });
      assert.throws(function() {
        Pitch.Octave.withNumber(Infinity);
      });
      assert.throws(function() {
        Pitch.Octave.withNumber(-Infinity);
      });
    });

    it('should accept a negative octave number', function() {
      Pitch.Octave.withNumber(-1);
    });
  });

});
