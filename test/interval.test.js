var assert = require('assert');

var Pitch = require('../src/pitch').Pitch;
var Interval = require('../src/interval').Interval;

describe('Interval', function() {

  describe('Interval.create', function() {

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

});
