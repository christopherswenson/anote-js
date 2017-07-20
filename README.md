# anote-js [![Build Status](https://travis-ci.org/travis-ci/travis-web.svg?branch=master)](https://travis-ci.org/travis-ci/travis-web)
A JavaScript library for musical notes, intervals, chords, etc.

```javascript
Interval.between(Pitch.BNatural4, Pitch.FNatural5) // Interval.Diminished5
Interval.Major3.above(Pitch.CNatural4) // Pitch.ENatural4
```

## Interval

- `Interval(quality, size)` constructs an interval of a given `quality` and `size`. `quality` must be one of the five predefined instances of `Interval.Quality`, and `size` must be a nonnegative integer.

This module provides helpful constants for all intervals with size from unison to twelfth, e.g. `Interval.Augmented4`, `Interval.Perfect8`, and `Interval.Major3`.

### Interval.Quality

This submodule provides constants used for the construction of the `Interval` class: `Interval.Quality.Major`, `.Minor`, `.Perfect`, `.Diminshed`, and `.Augmented`.

### Interval.Size

While the `Interval` constructor takes any nonnegative integer for `size`, `Interval.Size` provides some named constants for interval sizes from unison to twelfth: `Interval.Size.Unison`, `.Second`, `.Third`, ..., `.Eleventh`, and `.Twelfth`.

## Pitch

- `Pitch(name, accidental, octave)` constructs a pitch with the given pitch `name`, `accidental`, and `octave`.

This module defines helpful constants for all pitches from `Pitch.CDoubleFlat4` to `Pitch.BDoubleSharp8`. Note that constants for natural notes look like `Pitch.CNatural4`, not `Pitch.C4`.

### Pitch.Name

This submodule provides constants used for the construction of `Pitch` instances: `Pitch.Name.C`, `.D`, `.E`, `.F`, `.G`, `.A`, and `.B`.

### Pitch.Accidental

Use `Pitch.Accidental.fromOffset(offset)` to construct an instance of an accidental, where `offset` is an integer, `-2` representing a double-flat through `2` representing double-sharp. This will reuse instances of the predefined accidental constants, e.g. `Pitch.Accidental.Natural`.

Constants `Pitch.Accidental.Natural`, `.Sharp`, `.Flat`, `.DoubleSharp`, and `.DoubleFlat` are provided as well.

### Pitch.Octave

The `Pitch.Octave(number)` constructor creates an octave object to represent the octave of a pitch. `number` must be an integer.

