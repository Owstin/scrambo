import base from './base';
import { EP, CP } from './util/cubePositions';
import { shift } from './util/helpers';

const trizbll = function (register) {
  const scrambler = (function (scrambler) {
    const EPShift = [
      [EP.UR, EP.UF],
      [EP.UF, EP.UL],
      [EP.UL, EP.UB],
      [EP.UB, EP.UR]
    ];

    const CORIs = {
      T: [[1, 0, 0, 2], [0, 0, 2, 1]],
      U: [[2, 0, 0, 1], [0, 0, 1, 2]],
      L: [[1, 0, 2, 0], [2, 0, 1, 0]],
      S: [[2, 0, 2, 2]],
      As: [[1, 0, 1, 1]],
    }

    const getSubset = function (args) {
      if (!args.length) {
        const subsets = Object.keys(CORIs);
        return CORIs[subsets[scrambler.rn(subsets.length)]];
      } else {
        const subsets = args.filter(a => !!CORIs[a]);
        return CORIs[subsets[scrambler.rn(subsets.length)]];
      }
    }

    const getTRIZBLLScramble = function (args) {
      const s = scrambler.rn(4);
      const subset = getSubset(args);
      const co = shift(subset[0], s);
      const cori = [0, 0, 0, ...co, 0].reverse();

      let cpa = shift([CP.BLU, CP.BRU, CP.FRU, CP.FLU], s); // 5, 4, 7, 6
      const fixed = cpa[0];
      cpa = scrambler.shuffle(cpa.slice(1, 4))
      cpa = [4, 5, 6, 7].map(a => a === fixed ? fixed : cpa.splice(-1)[0]);

      return scrambler.getCustomScramble({
        ep: EPShift[s],
        cpa: [0, 1, 2, 3, ...cpa],
        cori: parseInt(cori.join(''), 3)
      });
    }

    return {
      initialize: scrambler.initialize,
      setRandomSrc: scrambler.setRandomSrc,
      getRandomScramble: function (args) {
        return {
          scramble_string: getTRIZBLLScramble(args)
        }
      },
      setScrambleLength: scrambler.setScrambleLength
    }
  })(base);

  register('trizbll', scrambler);
}

export default trizbll;
