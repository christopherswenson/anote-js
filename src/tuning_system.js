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

TuningSystem.MakePythagoreanTuning = function(base, frequency) {
  return new TuningSystem(function(pitch) {
    var currentUp = base;
    var currentDown = base;
    var fifthsAway = 0;
    var octaveOffset;
    while (true) {
      if (currentDown.isOctaveOf(pitch)) {
        fifthsAway = -fifthsAway;
        octaveOffset = currentDown.octave.number - pitch.octave.number;
        break;
      } else if (currentUp.isOctaveOf(pitch)) {
        octaveOffset = currentUp.octave.number - pitch.octave.number;
        break;
      }
      currentUp = Interval.Perfect5.above(currentUp);
      currentDown = Interval.Perfect5.below(currentDown);
      fifthsAway += 1;
    }
    var ratio = Math.pow(3 / 2, fifthsAway);
    return frequency * ratio * Math.pow(1 / 2, octaveOffset);
  });
}

TuningSystem.PythagoreanTuning = TuningSystem.PythagoreanTuningD288 = TuningSystem.MakePythagoreanTuning(Pitch.DNatural4, 288);

module.exports.TuningSystem = TuningSystem;
