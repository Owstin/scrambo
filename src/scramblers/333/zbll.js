import base from './base';
import { EP, CP } from './util/cubePositions';
import { shift } from './util/helpers';

const zbll = function (register) {
  const scrambler = (function (scrambler) {
    const getZBLLScramble = function (args) {
      const co = scrambler.getRandomCO(args);
      const cori = [0, 0, 0, ...shift(co, scrambler.rn(4)), 0].reverse();

      return scrambler.getCustomScramble({
        ep: [EP.UF, EP.UL, EP.UB, EP.UR],
        cp: [CP.FLU, CP.FRU, CP.BRU, CP.BLU],
        cori: parseInt(cori.join(''), 3)
      });
    }

    return {
      initialize: scrambler.initialize,
      setRandomSrc: scrambler.setRandomSrc,
      getRandomScramble: function (args) {
        return {
          scramble_string: getZBLLScramble(args)
        }
      },
      setScrambleLength: scrambler.setScrambleLength
    }
  })(base);

  register('zbll', scrambler, ['coll']);
}

export default zbll;
