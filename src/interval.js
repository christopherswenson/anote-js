'use strict';

var Pitch = require('./pitch').Pitch;
var Util = require('./util').Util;

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

module.exports.Interval = Interval;
