var assert = require('assert');

var Pitch = require('../src/pitch').Pitch;
var Interval = require('../src/pitch').Interval;
var TuningSystem = require('../src/pitch').TuningSystem;

describe('Pitch', function() {

  describe('Pitch.toFrequency', function() {

    it('works when using default tuning (TuningSystem.EqualTemperament)', function() {
      assert.equal(Math.round(Pitch.ANatural4.toFrequency()), 440);
      assert.equal(Math.round(Pitch.ANatural3.toFrequency()), 220);
      assert.equal(Math.round(Pitch.ANatural5.toFrequency()), 880);

      assert.equal(Math.round(Pitch.CNatural4.toFrequency()), 262);
      assert.equal(Math.round(Pitch.DNatural4.toFrequency()), 294);
      assert.equal(Math.round(Pitch.FSharp1.toFrequency()), 46);
    });

    it('works when using nondefault tuning', function() {
      assert(notImplemented);
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

  describe('Interval', function() {

    it('should accept good quality-size pairings', function() {
      [
        Interval.Size.Second,
        Interval.Size.Third,
        Interval.Size.Sixth,
        Interval.Size.Seventh,
      ].forEach(function(size) {
        [
          Interval.Quality.Major,
          Interval.Quality.Minor,
          Interval.Quality.Diminished,
          Interval.Quality.Augmented
        ].forEach(function(quality) {
          Interval.create(quality, size);
        });
      });

      [
        Interval.Size.Unison,
        Interval.Size.Fourth,
        Interval.Size.Fifth,
        Interval.Size.Octave,
      ].forEach(function(size) {
        [
          Interval.Quality.Perfect,
          Interval.Quality.Diminished,
          Interval.Quality.Augmented
        ].forEach(function(quality) {
          Interval.create(quality, size);
        });
      });
    });

    it('should reject bad quality-size pairings', function() {
      [
        Interval.Size.Second,
        Interval.Size.Third,
        Interval.Size.Sixth,
        Interval.Size.Seventh,
      ].forEach(function(size) {
        assert.throws(function() {
          Interval.create(Interval.Quality.Perfect, size);
        });
      });

      [
        Interval.Size.Unison,
        Interval.Size.Fourth,
        Interval.Size.Fifth,
        Interval.Size.Octave,
      ].forEach(function(size) {
        [
          Interval.Quality.Major,
          Interval.Quality.Minor
        ].forEach(function(quality) {
          assert.throws(function() {
            Interval.create(quality, size);
          });
        });
      });
    });

    it('should reject null size', function() {
      assert.throws(function() {
        Interval.create(Interval.Quality.Minor, null);
      });
    });

    it('should reject negative size', function() {
      assert.throws(function() {
        Interval.create(Interval.Quality.Minor, -1);
      });
    });

    it('should reject noninteger size', function() {
      assert.throws(function() {
        Interval.create(Interval.Quality.Minor, 1.5);
      });
      assert.throws(function() {
        Interval.create(Interval.Quality.Minor, "1");
      });
      assert.throws(function() {
        Interval.create(Interval.Quality.Minor, NaN);
      });
      assert.throws(function() {
        Interval.create(Interval.Quality.Minor, Infinity);
      });
      assert.throws(function() {
        Interval.create(Interval.Quality.Minor, -Infinity);
      });
    });

    it('should reject null quality', function() {
      assert.throws(function() {
        Interval.create(Interval.Quality.Minor, null);
      });
    });

  });

  describe('Interval.isEqualTo', function() {

    it('should return true when intervals are the same object', function() {
      assert(Interval.Major6.isEqualTo(Interval.Major6));
    });

    it('should return true when intervals are the same', function() {
      var Major6 = Interval.create(Interval.Quality.Major, Interval.Size.Sixth);
      assert(Major6.isEqualTo(Interval.Major6));
      assert(Interval.Major6.isEqualTo(Major6));
    });

    it('should return false when intervals are not the same', function() {
      assert(!Interval.Augmented4.isEqualTo(Interval.Diminished5));
      assert(!Interval.Diminished5.isEqualTo(Interval.Augmented4));
    });

  });

  describe('Interval.isEnharmonicTo', function() {

    it('should return true when intervals are the same object', function() {
      assert(Interval.Major6.isEnharmonicTo(Interval.Major6));
    });

    it('should return true when intervals are enharmonic', function() {
      assert(Interval.Augmented4.isEnharmonicTo(Interval.Diminished5));
      assert(Interval.Diminished5.isEnharmonicTo(Interval.Augmented4));
    });

    it('should return false when intervals are not enharmonic', function() {
      assert(!Interval.Augmented4.isEnharmonicTo(Interval.Perfect5));
      assert(!Interval.Perfect5.isEnharmonicTo(Interval.Augmented4));
    });

  });

  describe('Interval.between', function() {

    it('should be correct', function() {
      assert(Interval.between(Pitch.CNatural4, Pitch.CNatural4).isEqualTo(Interval.Perfect1));
      assert(Interval.between(Pitch.CNatural4, Pitch.CNatural5).isEqualTo(Interval.Perfect8));
      assert(Interval.between(Pitch.CNatural4, Pitch.FSharp4).isEqualTo(Interval.Augmented4));
      assert(Interval.between(Pitch.FSharp1, Pitch.ANatural4).isEqualTo(Interval.create(Interval.Quality.Minor, 24)));
    });

  });

  describe('Interval.above', function() {

    it('should be correct', function() {
      assert(Interval.Perfect1.above(Pitch.CNatural4).isEqualTo(Pitch.CNatural4));
      assert(Interval.Augmented4.above(Pitch.CNatural4).isEqualTo(Pitch.FSharp4));
      assert(Interval.Perfect8.above(Pitch.CNatural4).isEqualTo(Pitch.CNatural5));
      assert(Interval.Perfect5.above(Pitch.BNatural4).isEqualTo(Pitch.FSharp5));
    });

  });

  describe('Interval.below', function() {

    it('should be correct', function() {
      assert(Interval.Perfect1.below(Pitch.CNatural4).isEqualTo(Pitch.CNatural4));
      assert(Interval.Augmented4.below(Pitch.FSharp4).isEqualTo(Pitch.CNatural4));
      assert(Interval.Perfect8.below(Pitch.CNatural5).isEqualTo(Pitch.CNatural4));
      assert(Interval.Perfect5.below(Pitch.FSharp5).isEqualTo(Pitch.BNatural4));
    });

  });

  describe('Interval.Quality', function() {

    it('should reject new construction', function() {
      assert.throws(function() {
        new Interval.Quality(function() {}, function() {});
      })
    });

  });

  describe('TuningSystem', function() {

    describe('TuningSystem.EqualTemperament', function() {

      var toFrequency = TuningSystem.EqualTemperament.toFrequency;

      it('converts to frequency (Hz) correctly', function() {
        assert.equal(Math.round(toFrequency(Pitch.ANatural4)), 440);
        assert.equal(Math.round(toFrequency(Pitch.ANatural3)), 220);
        assert.equal(Math.round(toFrequency(Pitch.ANatural5)), 880);

        assert.equal(Math.round(toFrequency(Pitch.CNatural4)), 262);
        assert.equal(Math.round(toFrequency(Pitch.DNatural4)), 294);
        assert.equal(Math.round(toFrequency(Pitch.FSharp1)), 46);
      });

    });

    describe('TuningSystem.PythagoreanTuning', function() {

      var toFrequency = TuningSystem.PythagoreanTuning.toFrequency;

      it('converts to frequency (Hz) correctly', function() {
        for (var i = 0; i < 10000; i++) { // 349 ms --> 72 ms
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
            assert.equal(Math.round(toFrequency(testCase.pitch)), testCase.hz);
          });
        }
      });

    });

  });

});
