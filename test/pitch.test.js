var assert = require('assert');

var Pitch = require('../src/pitch').Pitch;
var Interval = require('../src/pitch').Interval;

describe('Pitch', function() {

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
          new Interval(quality, size);
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
          new Interval(quality, size);
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
          new Interval(Interval.Quality.Perfect, size);
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
            new Interval(quality, size);
          });
        });
      });
    });

    it('should reject null size', function() {
      assert.throws(function() {
        new Interval(Interval.Quality.Minor, null);
      });
    });

    it('should reject null quality', function() {
      assert.throws(function() {
        new Interval(Interval.Quality.Minor, null);
      });
    });

  });

  describe('Interval.isEqualTo', function() {

    it('should return true when intervals are the same object', function() {
      var interval = new Interval(Interval.Quality.Major, Interval.Size.Sixth);
      assert(interval.isEqualTo(interval));
    });

    it('should return true when intervals are the same', function() {
      var interval1 = new Interval(Interval.Quality.Major, Interval.Size.Sixth);
      var interval2 = new Interval(Interval.Quality.Major, Interval.Size.Sixth);
      assert(interval2.isEqualTo(interval1));
      assert(interval1.isEqualTo(interval2));
    });

    it('should return false when intervals are not the same', function() {
      var interval1 = new Interval(Interval.Quality.Augmented, Interval.Size.Fourth);
      var interval2 = new Interval(Interval.Quality.Diminished, Interval.Size.Fifth);
      assert(!interval2.isEqualTo(interval1));
      assert(!interval1.isEqualTo(interval2));
    });

  });

  describe('Interval.isEnharmonicTo', function() {

    it('should return true when intervals are the same object', function() {
      var interval = new Interval(Interval.Quality.Major, Interval.Size.Sixth);
      assert(interval.isEnharmonicTo(interval));
    });

    it('should return true when intervals are enharmonic', function() {
      var interval1 = new Interval(Interval.Quality.Augmented, Interval.Size.Fourth);
      var interval2 = new Interval(Interval.Quality.Diminished, Interval.Size.Fifth);
      assert(interval2.isEnharmonicTo(interval1));
      assert(interval1.isEnharmonicTo(interval2));
    });

    it('should return false when intervals are not enharmonic', function() {
      var interval1 = new Interval(Interval.Quality.Augmented, Interval.Size.Fourth);
      var interval2 = new Interval(Interval.Quality.Perfect, Interval.Size.Fifth);
      assert(!interval2.isEnharmonicTo(interval1));
      assert(!interval1.isEnharmonicTo(interval2));
    });

  });

  describe('Interval.between', function() {

    it('should be correct', function() {
      assert(Interval.between(Pitch.CNatural4, Pitch.CNatural4).isEqualTo(Interval.Perfect1));
      assert(Interval.between(Pitch.CNatural4, Pitch.CNatural5).isEqualTo(Interval.Perfect8));
      assert(Interval.between(Pitch.CNatural4, Pitch.FSharp4).isEqualTo(Interval.Augmented4));
    });

  });

  describe('Interval.above', function() {

    it('should be correct', function() {
      assert(Interval.Perfect1.above(Pitch.CNatural4).isEqualTo(Pitch.CNatural4));
      assert(Interval.Augmented4.above(Pitch.CNatural4).isEqualTo(Pitch.FSharp4));
      assert(Interval.Perfect8.above(Pitch.CNatural4).isEqualTo(Pitch.CNatural5));
    });

  });

  describe('Interval.below', function() {

    it('should be correct', function() {
      assert(Interval.Perfect1.below(Pitch.CNatural4).isEqualTo(Pitch.CNatural4));
      assert(Interval.Augmented4.below(Pitch.FSharp4).isEqualTo(Pitch.CNatural4));
      assert(Interval.Perfect8.below(Pitch.CNatural5).isEqualTo(Pitch.CNatural4));
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
