'use strict';

var Util = require('../src/util').Util;

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
    return tuningSystem.toFrequency(this);
  }

  halfStepsTo(other) {
    return Math.abs(this.absoluteChromaticIndex - other.absoluteChromaticIndex);
  }

  get name() {
    return Pitch.Name.all[this.scalarIndex];
  }

  get accidental() {
    var offset = this.absoluteChromaticIndex - (chromaticIndices[this.scalarIndex] + 12 * (this.octave.number));
    return Pitch.Accidental.fromOffset(offset);
  }

  get octave() {
    return Pitch.Octave.withNumber(Math.floor(this.absoluteScalarIndex / 7));
  }
}

Pitch.create = function(name, accidental, octave) {
  var scalarIndex = Pitch.Name.all.indexOf(name);
  var absoluteScalarIndex = Pitch.Name.all.indexOf(name) + (7 * octave.number);
  var absoluteChromaticIndex = chromaticIndices[scalarIndex] + accidental.offset + (12 * octave.number);
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

  isEqualTo(other) {
    return this === other;
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

var chromaticIndices = {
  0: 0,
  1: 2,
  2: 4,
  3: 5,
  4: 7,
  5: 9,
  6: 11
}

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

Pitch.Octave.withNumber = function(number) {
  return new Pitch.Octave(number);
}

Util.addErrorTypes(Pitch.Octave, "Pitch.Octave", [
  "NonintegerOctaveError",
]);

Pitch.Name.all.forEach(function(pitchName) {
  ["Natural", "Sharp", "Flat", "DoubleSharp", "DoubleFlat"].forEach(function(accidentalName) {
    var accidental = Pitch.Accidental[accidentalName];
    [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function(octaveNumber) {
      return Pitch.Octave.withNumber(octaveNumber);
    }).forEach(function(octave) {
      var pitch = Pitch.create(pitchName, accidental, octave);
      Pitch[pitchName.stringValue + accidentalName + octave.number] = pitch;
    });
  });
});

module.exports.Pitch = Pitch;
