import base from './base';

const zz = function (register) {
  const scrambler = (function (scrambler) {
    const getBadEdgeCount = function (args) {
      const filteredArgs = args
        .filter(a => /\d+/.test(a))
        .map(a => +a);

      if (!filteredArgs.length) {
        return 0;
      }
      return filteredArgs[scrambler.rn(filteredArgs.length)];
    }

    const getZZScramble = function (args) {
      const badEdgeCount = getBadEdgeCount(args);
      const eo = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (let i = 0; i < badEdgeCount; i++) {
        eo[i] = 1;
      }

      return scrambler.getCustomScramble({
        cp: [0, 1, 2, 3, 4, 5, 6],
        ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        co: [0, 1, 2, 3, 4, 5, 6],
        eori: parseInt(scrambler.shuffle(eo).join(''), 2)
      });
    }

    return {
      initialize: scrambler.initialize,
      setRandomSrc: scrambler.setRandomSrc,
      getRandomScramble: function (args) {
        return {
          scramble_string: getZZScramble(args)
        }
      },
      setScrambleLength: scrambler.setScrambleLength
    }
  })(base);

  register('zz', scrambler);
}

export default zz;
