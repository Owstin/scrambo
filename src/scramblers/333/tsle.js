import base from './base';
import { shift } from './util/helpers';

const tsle = function (register) {
  const scrambler = (function (scrambler) {
    const TSLE = {
      twoGen: function () {
        let cp = shift([4, 5, 6, 7], scrambler.rn(4));

        return {
          cpa: [0, 1, 2, cp[0], 3, cp[2], cp[1], cp[3]], // DFR FRU BLU FLU FRU
          ep: [8, 9, 10, 11]
        };
      }
    }

    const getTSLEScramble = function (args) {
      if (!args.length) {
        const subsets = Object.keys(TSLE);
        const subset = TSLE[subsets[scrambler.rn(subsets.length)]];
        return scrambler.getCustomScramble(subset());
      } else {
        const subset = TSLE[args[rn(args.length)]];
        return scrambler.getCustomScramble(subset());
      }
    }

    return {
      initialize: scrambler.initialize,
      setRandomSrc: scrambler.setRandomSrc,
      getRandomScramble: function (args) {
        return {
          scramble_string: getTSLEScramble(args)
        }
      },
      setScrambleLength: scrambler.setScrambleLength
    }
  })(base);

  register('tsle', scrambler);
}

export default tsle;
