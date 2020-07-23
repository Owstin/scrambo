import base from './base';
import { shift } from './util/helpers';

const cmll = function (register) {
  const scrambler = (function (scrambler) {
    const getCMLLScramble = function (args) {
      const co = scrambler.getRandomCO(args);
      const cori = [0, 0, 0, ...shift(co, scrambler.rn(4)), 0].reverse();

      return scrambler.getCustomScramble({
        cp: [4, 5, 6, 7],
        ep: [4, 6, 8, 9, 10, 11],
        cori: parseInt(cori.join(''), 3),
        eo: [0, 1, 2, 3, 5, 7]
      });
    }

    return {
      initialize: scrambler.initialize,
      setRandomSrc: scrambler.setRandomSrc,
      getRandomScramble: function (args) {
        return {
          scramble_string: getCMLLScramble(args)
        }
      },
      setScrambleLength: scrambler.setScrambleLength
    }
  })(base);

  register('cmll', scrambler, ['l10p']);
}

export default cmll;
