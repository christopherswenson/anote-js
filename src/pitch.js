'use strict';

var Util = require('../src/util').Util;

class Interval {
  constructor(scalarOffset, chromaticOffset) {
    this.scalarOffset = scalarOffset;
    this.chromaticOffset = chromaticOffset;
  }

  above(pitch) {
    var absoluteScalarIndex = pitch.absoluteScalarIndex + this.scalarOffset;
    var absoluteChromaticIndex = pitch.absoluteChromaticIndex + this.chromaticOffset
    return new Pitch(absoluteScalarIndex, absoluteChromaticIndex);
  }

  below(pitch) {
    var absoluteScalarIndex = pitch.absoluteScalarIndex - this.scalarOffset;
    var absoluteChromaticIndex = pitch.absoluteChromaticIndex - this.chromaticOffset
    return new Pitch(absoluteScalarIndex, absoluteChromaticIndex);
  }

  isEqualTo(other) {
    return this.scalarOffset == other.scalarOffset
      && this.chromaticOffset == other.chromaticOffset;
  }

  isEnharmonicTo(other) {
    return this.chromaticOffset == other.chromaticOffset;
  }

  get size() {
    return this.scalarOffset + 1;
  }

  get quality() {
    var offset = [11, 0, 2, 4, 5, 7, 9][this.scalarOffset % 7] - this.chromaticOffset;
    return Interval.Quality.fromOffset(offset);
  }
}

Interval.create = function(quality, size) {
  if (size === null || size === undefined) {
    throw new Interval.NullSizeError("Interval Size may not be null.");
  } else if (!Number.isInteger(size)) {
    throw new Interval.NonintegerSizeError("Interval Size must be an integer.");
  } else if (size < 1) {
    throw new Interval.NonpositiveSizeError("Interval Size must be positive.");
  } else if (quality === null || quality === undefined) {
    throw new Interval.NullQualityError("Interval Quality may not be null.");
  } else if (!quality.isAllowed(size)) {
    throw new Interval.InvalidQualityError("Invalid Quality for Interval with Size " + size + ".");
  }
  var scalarOffset = size - 1;
  var chromaticOffset = quality.getHalfSteps(size);
  return new Interval(scalarOffset, chromaticOffset);
}

Util.addErrorTypes(Interval, "Interval", [
  "NullSizeError",
  "NonpositiveSizeError",
  "NonintegerSizeError",
  "NullQualityError",
  "InvalidQualityError",
]);

var intervalQualitiesFixed = false;
Interval.Quality = class {
  constructor(isAllowed, getOffset) {
    if (intervalQualitiesFixed) {
      throw new Interval.Quality.IllegalConstructionError("Illegal construction of Interval.Quality.")
    }
    this.getOffset = getOffset;
    this.isAllowed = isAllowed;
  }

  getHalfSteps(size) {
    return [11, 0, 2, 4, 5, 7, 9][size % 7] + Math.floor(size / 7) * 12 + this.getOffset(size);
  }

  isEqualTo(other) {
    return this === other;
  }
}

Util.addErrorTypes(Interval.Quality, "Interval.Quality", [
  "IllegalConstructionError"
]);

var isAllowed2367 = function(size) {
  return ~[0, 2, 3, 6].indexOf(size % 7);
}

var isAllowed1458 = function(size) {
  return ~[1, 4, 5].indexOf(size % 7);
}

var isAllowedAll = function(size) {
  return true;
}

Interval.Quality.Major      = new Interval.Quality(isAllowed2367, (size) => 0);
Interval.Quality.Perfect    = new Interval.Quality(isAllowed1458, (size) => 0);
Interval.Quality.Minor      = new Interval.Quality(isAllowed2367, (size) => -1);
Interval.Quality.Augmented  = new Interval.Quality(isAllowedAll,  (size) => 1);
Interval.Quality.Diminished = new Interval.Quality(isAllowedAll,  function(size) {
  return ~[1, 4, 5].indexOf(size % 7) ? -1 : -2;
});
intervalQualitiesFixed = true;

Interval.Quality.fromOffset = function(size, offset) {
  if (isAllowed2367(size % 7)) {
    switch(Util.positiveModulus(offset, 12)) {
      case  1: return Interval.Quality.Augmented;
      case  0: return Interval.Quality.Major;
      case 11: return Interval.Quality.Minor;
      case 10: return Interval.Quality.Diminished;
    }
  } else {
    switch(Util.positiveModulus(offset, 12)) {
      case  1: return Interval.Quality.Augmented;
      case  0: return Interval.Quality.Perfect;
      case 11: return Interval.Quality.Diminished;
    }
  }
  throw new Interval.Quality.InvalidOffsetError('Invalid offset ' + offset + ' (' + Util.positiveModulus(offset, 12) + ') for Interval of size ' + size + '.');
}

Util.addErrorTypes(Interval.Quality, "Interval.Quality", [
  "InvalidOffsetError",
]);

Interval.Size = {
  Unison: 1,
  Second: 2,
  Third: 3,
  Fourth: 4,
  Fifth: 5,
  Sixth: 6,
  Seventh: 7,
  Octave: 8,
  Ninth: 9,
  Tenth: 10,
  Eleventh: 11,
  Twelfth: 12
};

["Major", "Perfect", "Minor", "Augmented", "Diminished"].forEach(function(qualityName) {
  var quality = Interval.Quality[qualityName];
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach(function(size) {
    if (quality.isAllowed(size)) {
      Interval[qualityName + size] = Interval.create(quality, size);
    }
  });
});

Interval.between = function(pitch1, pitch2) {
  var scalarOffset = pitch1.absoluteScalarIndex - pitch2.absoluteScalarIndex;
  var chromaticOffset = pitch1.absoluteChromaticIndex - pitch2.absoluteChromaticIndex;
  var sign = pitch1.isBelow(pitch2) ? -1 : 1;
  return new Interval(sign * scalarOffset, sign * chromaticOffset);
}

class Pitch {
  constructor(absoluteScalarIndex, absoluteChromaticIndex) {
    this.absoluteScalarIndex = absoluteScalarIndex;
    this.absoluteChromaticIndex = absoluteChromaticIndex;
  }

  get chromaticIndex() {
    return Util.positiveModulus(this.absoluteChromaticIndex, 12);
  }

  get scalarIndex() {
    return Util.positiveModulus(this.absoluteScalarIndex, 7);
  }

  isEqualTo(other) {
    return this.absoluteScalarIndex == other.absoluteScalarIndex
      && this.absoluteChromaticIndex == other.absoluteChromaticIndex;
  }

  isEnharmonicTo(other) {
    return this.absoluteChromaticIndex == other.absoluteChromaticIndex;
  }

  isAbove(other) {
    return this.absoluteChromaticIndex > other.absoluteChromaticIndex;
  }

  isBelow(other) {
    return this.absoluteChromaticIndex < other.absoluteChromaticIndex;
  }

  isOctaveOf(other) {
    return this.scalarIndex == other.scalarIndex
      && this.chromaticIndex == other.chromaticIndex;
  }

  toFrequency(tuningSystem) {
    return (tuningSystem || TuningSystem.EqualTemperament).toFrequency(this);
  }

  halfStepsTo(other) {
    return Math.abs(this.absoluteChromaticIndex - other.absoluteChromaticIndex);
  }

  get name() {
    return Pitch.Name.all[this.scalarIndex];
  }

  get accidental() {
    var offset = this.chromaticIndex - chromaticIndices[this.name.stringValue];
    return Pitch.Accidental.fromOffset(offset);
  }

  get octave() {
    return new Pitch.Octave(Math.floor(this.absoluteScalarIndex / 7));
  }
}

Pitch.create = function(name, accidental, octave) {
  var absoluteScalarIndex = Pitch.Name.all.indexOf(name) + (7 * octave.number);
  var absoluteChromaticIndex = chromaticIndices[name.stringValue] + accidental.offset + (12 * octave.number);
  return new Pitch(absoluteScalarIndex, absoluteChromaticIndex);
}

Pitch.Accidental = class {
  constructor(offset) {
    this.offset = offset;
  }

  isEqualTo(other) {
    return this.offset == other.offset;
  }
}

var offsetMap = {};
offsetMap[ 0] = Pitch.Accidental.Natural     = new Pitch.Accidental( 0);
offsetMap[ 1] = Pitch.Accidental.Sharp       = new Pitch.Accidental( 1);
offsetMap[-1] = Pitch.Accidental.Flat        = new Pitch.Accidental(-1);
offsetMap[ 2] = Pitch.Accidental.DoubleSharp = new Pitch.Accidental( 2);
offsetMap[-2] = Pitch.Accidental.DoubleFlat  = new Pitch.Accidental(-2);

Pitch.Accidental.fromOffset = function(offset) {
  return offsetMap[offset] || new Pitch.Accidental(offset);
}

var pitchNamesFixed = false;
Pitch.Name = class {
  constructor(stringValue) {
    if (pitchNamesFixed) {
      throw new Pitch.Name.IllegalConstructionError("Illegal construction of Pitch.Name with string value '" + stringValue + "'.");
    }
    this.stringValue = stringValue;
  }
}

Util.addErrorTypes(Pitch.Name, "Pitch.Name", [
  "IllegalConstructionError",
]);

Pitch.Name = {
  C: new Pitch.Name('C'),
  D: new Pitch.Name('D'),
  E: new Pitch.Name('E'),
  F: new Pitch.Name('F'),
  G: new Pitch.Name('G'),
  A: new Pitch.Name('A'),
  B: new Pitch.Name('B')
}
pitchNamesFixed = true;

Pitch.Name.all = 'CDEFGAB'.split("").map((letter) => Pitch.Name[letter]);

var chromaticIndices = {}
chromaticIndices['C'] = 0;
chromaticIndices['D'] = 2;
chromaticIndices['E'] = 4;
chromaticIndices['F'] = 5;
chromaticIndices['G'] = 7;
chromaticIndices['A'] = 9;
chromaticIndices['B'] = 11;

Pitch.Octave = class {
  constructor(number) {
    this.number = number;
    if (!Number.isInteger(number)) {
      throw new Pitch.Octave.NonintegerOctaveError("Octave number must be an integer.");
    }
  }

  isEqualTo(other) {
    return this.number == other.number;
  }
}

Util.addErrorTypes(Pitch.Octave, "Pitch.Octave", [
  "NonintegerOctaveError",
]);

Pitch.Name.all.forEach(function(pitchName) {
  ["Natural", "Sharp", "Flat", "DoubleSharp", "DoubleFlat"].forEach(function(accidentalName) {
    var accidental = Pitch.Accidental[accidentalName];
    [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function(octaveNumber) {
      return new Pitch.Octave(octaveNumber);
    }).forEach(function(octave) {
      var pitch = Pitch.create(pitchName, accidental, octave);
      Pitch[pitchName.stringValue + accidentalName + octave.number] = pitch;
    });
  });
});

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

console.log(Interval.Perfect5)

module.exports.Pitch = Pitch;
module.exports.Interval = Interval;
module.exports.TuningSystem = TuningSystem;
