import base from './base';

const standard = function (register) {
  const scrambler = (function (scrambler) {
    const getRandomScramble = function () {
      return scrambler.customScramble(
        [0, 1, 2, 3, 4, 5, 6, 7],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        [0, 1, 2, 3, 4, 5, 6, 7],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      );
    }

    return {
      initialize: scrambler.initialize,
      setRandomSrc: scrambler.setRandomSrc,
      getRandomScramble: function () {
        return {
          scramble_string: getRandomScramble()
        }
      },
      setScrambleLength: scrambler.setScrambleLength
    }
  })(base);

  register('333', scrambler, ['3', '3x3', '3x3x3']);
}

export default standard;
