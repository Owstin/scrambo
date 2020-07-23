import base from './base';
import { shift } from './util/helpers';

const scramble2gll = function (register) {
  const scrambler = (function (scrambler) {
    const get2GLLScramble = function (args) {
      const co = scrambler.getRandomCO(args);
      const cori = [0, 0, 0, ...shift(co, scrambler.rn(4)), 0].reverse();

      return scrambler.getCustomScramble({
        ep: [8, 9, 10, 11],
        cori: parseInt(cori.join(''), 3)
      });
    }

    return {
      initialize: scrambler.initialize,
      setRandomSrc: scrambler.setRandomSrc,
      getRandomScramble: function (args) {
        return {
          scramble_string: get2GLLScramble(args)
        }
      },
      setScrambleLength: scrambler.setScrambleLength
    }
  })(base);

  register('2gll', scrambler);
}

export default scramble2gll;
