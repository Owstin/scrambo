import base from './base';

const zzll = function (register) {
  const scrambler = (function (scrambler) {
    const getZZLSScramble = function () {
      return scrambler.customScramble(
        [3, 4, 5, 6, 7],
        [3, 8, 9, 10, 11],
        [2, 3, 4, 5, 6],
        []
      )
    }

    return {
      initialize: scrambler.initialize,
      setRandomSrc: scrambler.setRandomSrc,
      getRandomScramble: function () {
        return {
          scramble_string: getZZLSScramble()
        }
      },
      setScrambleLength: scrambler.setScrambleLength
    }
  })(base);

  register('zzll', scrambler);
}

export default zzll;
