import base from './base';

const edges = function (register) {
  const scrambler = (function (scrambler) {
    const getEdgeScramble = function () {
      return scrambler.customScramble(
        [],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        [],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      );
    }

    return {
      initialize: scrambler.initialize,
      setRandomSrc: scrambler.setRandomSrc,
      getRandomScramble: function () {
        return {
          scramble_string: getEdgeScramble()
        }
      },
      setScrambleLength: scrambler.setScrambleLength
    }
  })(base);

  register('edges', scrambler);
}

export default edges;
