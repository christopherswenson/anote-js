var assert = require('assert');

var Pitch = require('../src/pitch').Pitch;
var Interval = require('../src/interval').Interval;
var TuningSystem = require('../src/tuning_system').TuningSystem;

describe('TuningSystem', function() {

  describe('TuningSystem.EqualTemperament', function() {

    var toFrequency = TuningSystem.EqualTemperament.toFrequency;

    it('converts to frequency (Hz) correctly', function() {
      assert.equal(Math.round(toFrequency(Pitch.ANatural4)), 440);
      assert.equal(Math.round(toFrequency(Pitch.ANatural3)), 220);
      assert.equal(Math.round(toFrequency(Pitch.ANatural5)), 880);

      assert.equal(Math.round(toFrequency(Pitch.CNatural4)), 262);
      assert.equal(Math.round(toFrequency(Pitch.DNatural4)), 294);
      assert.equal(Math.round(toFrequency(Pitch.FSharp1)), 46);
    });

  });

  describe('TuningSystem.PythagoreanTuning', function() {

    var toFrequency = TuningSystem.PythagoreanTuning.toFrequency;

    it('converts to frequency (Hz) correctly', function() {
      [
        {pitch: Pitch.ANatural3, hz: 216},
        {pitch: Pitch.ASharp3,   hz: 231},
        {pitch: Pitch.BNatural3, hz: 243},
        {pitch: Pitch.CNatural4, hz: 256},
        {pitch: Pitch.CSharp4,   hz: 273},
        {pitch: Pitch.DNatural4, hz: 288},
        {pitch: Pitch.EFlat4,    hz: 303},
        {pitch: Pitch.DSharp4,   hz: 308},
        {pitch: Pitch.ENatural4, hz: 324},
        {pitch: Pitch.FNatural4, hz: 341},
        {pitch: Pitch.FSharp4,   hz: 365},
        {pitch: Pitch.GNatural4, hz: 384},
        {pitch: Pitch.AFlat4,    hz: 405},
        {pitch: Pitch.GSharp4,   hz: 410},
        {pitch: Pitch.ANatural4, hz: 432},
        {pitch: Pitch.BFlat4,    hz: 455},
      ].forEach(function(testCase) {
        assert.equal(Math.round(toFrequency(testCase.pitch)), testCase.hz);
      });
    });

  });

  describe('TuningSystem.QuarterCommaMeantone', function() {

    var toFrequency = TuningSystem.QuarterCommaMeantone.toFrequency;

    it('converts to frequency (Hz) correctly', function() {
      [
        {pitch: Pitch.ANatural3, hz: 215},
        {pitch: Pitch.ASharp3,   hz: 225},
        {pitch: Pitch.BNatural3, hz: 241},
        {pitch: Pitch.CNatural4, hz: 258},
        {pitch: Pitch.CSharp4,   hz: 269},
        {pitch: Pitch.DNatural4, hz: 288},
        {pitch: Pitch.EFlat4,    hz: 308},
        {pitch: Pitch.DSharp4,   hz: 301},
        {pitch: Pitch.ENatural4, hz: 322},
        {pitch: Pitch.FNatural4, hz: 345},
        {pitch: Pitch.FSharp4,   hz: 360},
        {pitch: Pitch.GNatural4, hz: 385},
        {pitch: Pitch.AFlat4,    hz: 412},
        {pitch: Pitch.GSharp4,   hz: 402},
        {pitch: Pitch.ANatural4, hz: 431},
        {pitch: Pitch.BFlat4,    hz: 461},
      ].forEach(function(testCase) {
        assert.equal(Math.round(toFrequency(testCase.pitch)), testCase.hz);
      });
    });

  });

});
