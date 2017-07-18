'use strict';

function addErrorTypes(classConstructor, className, errorNames) {
  errorNames.forEach(function(errorName) {
    classConstructor[errorName] = function(message) {
      this.name = className + '.' + errorName;
      this.message = message || "";
    }
    classConstructor[errorName].prototype = Error.prototype;
  });
}

function positiveModulus(a, n) {
  return ((a % n) + n) % n;
}

function intervalUpDown(interval, pitch, below) {
  var multiplier = below ? -1 : 1;
  var number = pitch.scalarIndex;
  var octaveOffset = Math.abs(Math.floor((number + multiplier * (interval.size - 1)) / 7));

  var name = Pitch.Name.all[(number + multiplier * (interval.size - 1)) % 7];
  var accidental = Pitch.Accidental.fromOffset(pitch.accidental.offset + multiplier * interval.quality.getOffset(interval.size));
  var octave = new Pitch.Octave(pitch.octave.number + multiplier * octaveOffset);
  return new Pitch(name, accidental, octave);
}

class Interval {
  constructor(quality, size) {
    this.size = size;
    this.quality = quality;
    if (size === null || size === undefined) {
      throw new Interval.NullSizeError("Interval Size may not be null.");
    } else if (size < 0) {
      throw new Interval.NegativeSizeError("Interval Size may not be negative.");
    } else if (quality === null || quality === undefined) {
      throw new Interval.NullQualityError("Interval Quality may not be null.");
    } else if (!quality.isAllowed(size)) {
      throw new Interval.InvalidQualityError("Invalid Quality for Interval with Size " + size + ".");
    }
    this.halfSteps = quality.getHalfSteps(size);
  }

  above(pitch) {
    return intervalUpDown(this, pitch, false);
  }

  below(pitch) {
    return intervalUpDown(this, pitch, true);
  }

  isEqualTo(other) {
    return this.size == other.size
      && this.quality.isEqualTo(other.quality);
  }

  isEnharmonicTo(other) {
    return this.halfSteps == other.halfSteps;
  }
}

addErrorTypes(Interval, "Interval", [
  "NullSizeError",
  "NegativeSizeError",
  "NullQualityError",
  "InvalidQualityError",
]);

Interval.Quality = class {
  constructor(isAllowed, getOffset) {
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

Interval.Quality.fromOffset = function(size, offset) {
  if (isAllowed2367(size % 7)) {
    switch(positiveModulus(offset, 12)) {
      case  1: return Interval.Quality.Augmented;
      case  0: return Interval.Quality.Major;
      case -1: return Interval.Quality.Minor;
      case -2: return Interval.Quality.Diminished;
    }
  } else {
    switch(positiveModulus(offset, 12)) {
      case  1: return Interval.Quality.Augmented;
      case  0: return Interval.Quality.Perfect;
      case -1: return Interval.Quality.Diminished;
    }
  }
  throw new Interval.Quality.InvalidOffsetError('Invalid offset ' + offset + ' (' + positiveModulus(offset, 12) + ') for Interval of size ' + size + '.');
}

addErrorTypes(Interval.Quality, "Interval.Quality", [
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
      Interval[qualityName + size] = new Interval(quality, size);
    }
  });
});

Interval.between = function(pitch1, pitch2) {
  var scalarOffset = Math.abs(pitch1.scalarIndex - pitch2.scalarIndex) + 1;
  var octaveOffset = Math.abs(pitch1.octave.number - pitch2.octave.number);
  var totalSize = scalarOffset + 7 * octaveOffset;
  var chromaticOffset = Math.abs(pitch1.chromaticIndex - pitch2.chromaticIndex);
  var defaultOffset = Interval.Quality.Perfect.getHalfSteps(totalSize);
  var quality = Interval.Quality.fromOffset(totalSize, chromaticOffset - defaultOffset);
  return new Interval(quality, totalSize);
}

class Pitch {
  constructor(name, accidental, octave) {
    this.name = name;
    this.accidental = accidental;
    this.octave = octave;
  }

  get chromaticIndex() {
    return chromaticIndices[this.name.stringValue] + this.accidental.offset;
  }

  get scalarIndex() {
    return Pitch.Name.all.indexOf(this.name);
  }

  isEqualTo(other) {
    return this.name === other.name
      && this.accidental.isEqualTo(other.accidental)
      && this.octave.isEqualTo(other.octave);
  }
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

addErrorTypes(Pitch.Name, "Pitch.Name", [
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
  }

  isEqualTo(other) {
    return this.number == other.number;
  }
}

Pitch.Name.all.forEach(function(pitchName) {
  ["Natural", "Sharp", "Flat", "DoubleSharp", "DoubleFlat"].forEach(function(accidentalName) {
    var accidental = Pitch.Accidental[accidentalName];
    [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function(octaveNumber) {
      return new Pitch.Octave(octaveNumber);
    }).forEach(function(octave) {
      var pitch = new Pitch(pitchName, accidental, octave);
      Pitch[pitchName.stringValue + accidentalName + octave.number] = pitch;
    });
  });
});

module.exports.Pitch = Pitch;
module.exports.Interval = Interval;
