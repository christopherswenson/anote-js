'use strict';

var Pitch = require('./pitch').Pitch;
var Interval = require('./interval').Interval;

class TuningSystem {
  constructor(toFrequency) {
    this.toFrequency = toFrequency;
  }
}

TuningSystem.MakeEqualTemperament = function(base, frequency) {
  return new TuningSystem(function(pitch) {
    var chromaticOffset = Interval.between(pitch, base).chromaticOffset;
    var sign = pitch.isBelow(base) ? -1 : 1;
    var k12thRoot2 = Math.pow(2, 1 / 12);
    return frequency * Math.pow(k12thRoot2, sign * chromaticOffset);
  });
}

TuningSystem.EqualTemperament = TuningSystem.EqualTemperamentA440 = TuningSystem.MakeEqualTemperament(Pitch.ANatural4, 440);

var make5thBasedTuningFunction = function(base, frequency, fifthRatio) {
  return function toFrequency(pitch) {
    var a1 = pitch.absoluteScalarIndex;
    var a2 = pitch.absoluteChromaticIndex;
    var b1 = Interval.Perfect5.scalarOffset;
    var b2 = Interval.Perfect5.chromaticOffset;
    var c1 = base.absoluteScalarIndex;
    var c2 = base.absoluteChromaticIndex;

    // solved the equations
      // a1 - b1 * n = c1 +  7 * k
      // a2 - b2 * n = c2 + 12 * k

    var n = (12 * a1 - 7 * a2 - 12 * c1 + 7 * c2) / (12 * b1 - 7 * b2); // fifths away
    var k = (a1 * b2 - a2 * b1 + b1 * c2 - b2 * c1) / (12 * b1 - 7 * b2); // octave offset

    var ratio = Math.pow(fifthRatio, n);
    return frequency * ratio * Math.pow(1 / 2, k);
  }
}

TuningSystem.MakePythagoreanTuning = function(base, frequency) {
  return new TuningSystem(make5thBasedTuningFunction(base, frequency, 3 / 2));
}

TuningSystem.PythagoreanTuning = TuningSystem.PythagoreanTuningD288 = TuningSystem.MakePythagoreanTuning(Pitch.DNatural4, 288);

TuningSystem.MakeQuarterCommaMeantone = function(base, frequency) {
  return new TuningSystem(make5thBasedTuningFunction(base, frequency, Math.pow(5, 1 / 4)));
}

TuningSystem.QuarterCommaMeantone = TuningSystem.MakeQuarterCommaMeantone(Pitch.DNatural4, 288);

module.exports.TuningSystem = TuningSystem;
