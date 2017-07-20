# anote-js [![Build Status](https://travis-ci.org/travis-ci/travis-web.svg?branch=master)](https://travis-ci.org/travis-ci/travis-web)
A JavaScript library for musical notes, intervals, chords, etc.

```javascript
Interval.between(Pitch.BNatural4, Pitch.FNatural5) // Interval.Diminished5
Interval.Major3.above(Pitch.CNatural4) // Pitch.ENatural4
```

## Pitch

This class represents a pitch, or in other words a musical note with no duration. A `Pitch` is an abstraction on frequency (Hz). Given a `TuningSystem` instance, a `Pitch` instance may be serialized into a frequency. 

This module includes constants for all pitches from `Pitch.CDoubleFlat0` to `Pitch.BDoubleSharp8`. Note that constants for natural notes look like `Pitch.CNatural4`, not `Pitch.C4`.

A `Pitch` is stored internally as an `absoluteScalarIndex` and an `absoluteChromaticIndex`. The absolute scalar index represents the number of pitch names the pitch is above `Pitch.CNatural0`, and the absolute chromatic index represents the number of half steps the pitch is above `Pitch.CNatural0`.

- `Pitch.create(name, accidental, octave)` constructs a pitch with the given pitch `name`, `accidental`, and `octave`.

### Pitch.Name

This submodule provides constants used for the construction of `Pitch` instances: `Pitch.Name.C`, `.D`, `.E`, `.F`, `.G`, `.A`, and `.B`.

### Pitch.Accidental

Use `Pitch.Accidental.fromOffset(offset)` to construct an instance of an accidental, where `offset` is an integer, `-2` representing a double-flat through `2` representing double-sharp. This will reuse instances of the predefined accidental constants, e.g. `Pitch.Accidental.Natural`.

Constants `Pitch.Accidental.Natural`, `.Sharp`, `.Flat`, `.DoubleSharp`, and `.DoubleFlat` are provided as well.

### Pitch.Octave

The `Pitch.Octave(number)` constructor creates an octave object to represent the octave of a pitch. `number` must be an integer.

## Interval

An instance of `Interval` represents a delta between two notes. Thus, it must take into account both the differential in scale index and in chromatic index. 

To create an interval, use either `Interval.between(pitch1, pitch2)` or `Interval.create(quality, size)`. The former constructs an interval between two notes (in either order), and the latter creates an interval from its quality (e.g. `Interval.Quality.Minor`) and size (`Interval.Size.Third == 3`).

- `Interval.between(pitch1, pitch2)` computes the interval between two pitches.

- `Interval.create(quality, size)` constructs an interval of a given `quality` and `size`. `quality` must be one of the five predefined instances of `Interval.Quality`, and `size` must be a nonnegative integer.

Internally, an instance of `Interval` is stored as a `scalarOffset` and a `chromaticOffset`. For example, an octave has a scalar offset of `7` and a chromatic offset of `12`.

This module provides constants for all intervals with size from unison to twelfth, e.g. `Interval.Augmented4`, `Interval.Perfect8`, and `Interval.Major3`.

### Interval.Quality

This submodule provides constants used for the construction of the `Interval` class: `Interval.Quality.Major`, `.Minor`, `.Perfect`, `.Diminshed`, and `.Augmented`.

### Interval.Size

While the `Interval` constructor takes any nonnegative integer for `size`, `Interval.Size` provides some named constants for interval sizes from unison to twelfth: `Interval.Size.Unison`, `.Second`, `.Third`, ..., `.Eleventh`, and `.Twelfth`.

## Tuning System

A tuning system is a way to serialize abstract pitches to frequencies. A `TuningSystem` instance is defined entirely by by its one member function, `.toFrequency(pitch)`. New tuning systems may be defined with `new TuningSystem(toFrequency)`, where `toFrequency` is a function that accepts a pitch and returns its frequency. Some common tuning systems are easily accessible with the following constants:

- `TuningSystem.EqualTemperament` with A440
- `TuningSystem.PythagoreanTuning` with D288
- `TuningSystem.QuarterCommaMeantone` with D288

### TuningSystem.EqualTemperament

In equal temperament, the tuning system used most commonly today, all half steps are the same distance apart, relative to the octave. Each octave is tuned at a ratio of `1:2`, and the twelve chromatic pitches in between are dispersed evenly. Each half step is tuned at a ratio of `1:Math.pow(2, 1 / 12)`.

Read more at [wikipedia](https://en.wikipedia.org/wiki/Equal_temperament).

### TuningSystem.PythagoreanTuning

In Pythagorean tuning, perfect fifths are all tuned to exactly the ratio of `3:2`. 

Read more at [wikipedia](https://en.wikipedia.org/wiki/Pythagorean_tuning).

### TuningSystem.QuarterCommaMeantone
Read more at [wikipedia](https://en.wikipedia.org/wiki/Quarter-comma_meantone).
