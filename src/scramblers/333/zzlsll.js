import base from './base';

const zzlsll = function (register) {
  const scrambler = (function (scrambler) {
    const getZZL2SLLScramble = function () {
      return scrambler.customScramble(
        [2, 3, 4, 5, 6, 7],
        [2, 3, 8, 9, 10, 11],
        [1, 2, 3, 4, 5, 6],
        []
      );
    }

    return {
      initialize: scrambler.initialize,
      setRandomSrc: scrambler.setRandomSrc,
      getRandomScramble: function () {
        return {
          scramble_string: getZZL2SLLScramble()
        }
      },
      setScrambleLength: scrambler.setScrambleLength
    }
  })(base);

  register('zzlsll', scrambler);
}

export default zzlsll;
