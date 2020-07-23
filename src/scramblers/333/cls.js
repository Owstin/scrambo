import base from './base';
import { shift, sum } from './util/helpers';

const cls = function (register) {
  const scrambler = (function (scrambler) {
    const rn = scrambler.rn;
    const shuffle = scrambler.shuffle;
    const clsSubsets = {
      '-': function (num) {
        const cpa = shuffle([4, 5, 6, 7]);
        const c = num < 0
          ? [rn(3), rn(3), rn(3)]
          : [
            num > 0 ? rn(2) + 1 : 0,
            num > 1 ? rn(2) + 1 : 0,
            num > 2 ? rn(2) + 1 : 0
          ];
        const co = shift(c, rn(3)); // BRU BLU FLU
        const cori = [0, 0, 0, co[0], co[1], co[2], 2, 0];
        cori[2] = (3 - sum(cori) % 3) % 3;
        cori.reverse();

        return {
          cp: [3, 4, 5, 6],
          cpa: [0, 1, 2, cpa[0], cpa[1], cpa[2], cpa[3], 3],
          ep: [8, 9, 10, 11],
          cori: parseInt(cori.join(''), 3)
        };
      },
      '+': function () {
        const cpa = shuffle([4, 5, 6, 7]);
        const co = shift([rn(3), rn(3), rn(3)], rn(1)); // BRU BLU FLU
        const cori = [0, 0, 0, co[0], co[1], co[2], 1, 0];
        cori[2] = (3 - sum(cori) % 3) % 3;
        cori.reverse();

        return {
          cp: [3, 4, 5, 6],
          cpa: [0, 1, 2, cpa[0], cpa[1], cpa[2], cpa[3], 3],
          ep: [8, 9, 10, 11],
          cori: parseInt(cori.join(''), 3)
        };
      },
      'O': function () {
        const cpa = shuffle([4, 5, 6, 7]);
        const co = shift([rn(3), rn(3), rn(3)], rn(1)); // BRU BLU FLU
        const cori = [0, 0, 0, co[0], co[1], co[2], 0, 0];
        cori[2] = (3 - sum(cori) % 3) % 3;
        cori.reverse();

        return {
          cp: [3, 4, 5, 6],
          cpa: [0, 1, 2, cpa[0], cpa[1], cpa[2], cpa[3], 3],
          ep: [8, 9, 10, 11],
          cori: parseInt(cori.join(''), 3)
        };
      },
      'i': function () {
        const cpa = shuffle([4, 5, 6, 7]);
        const co = shift([rn(3), rn(3), rn(3)], rn(4)); // BRU BLU FLU
        const cori = [0, 0, 1, co[0], co[1], co[2], 0, 0];
        cori[6] = (3 - sum(cori) % 3) % 3;
        cori.reverse();

        return {
          cp: [3, 4, 5, 6],
          cpa: [0, 1, 2, 3, cpa[0], cpa[1], cpa[2], cpa[3]],
          ep: [8, 9, 10, 11],
          cori: parseInt(cori.join(''), 3)
        };
      },
      'im': function () {
        const cpa = shuffle([4, 5, 6, 7]);
        const co = shift([rn(3), rn(3), rn(3)], rn(4)); // BRU BLU FLU
        const cori = [0, 0, 2, co[0], co[1], co[2], 0, 0];
        cori[6] = (3 - sum(cori) % 3) % 3;
        cori.reverse();

        return {
          cp: [3, 4, 5, 6],
          cpa: [0, 1, 2, 3, cpa[0], cpa[1], cpa[2], cpa[3]],
          ep: [8, 9, 10, 11],
          cori: parseInt(cori.join(''), 3)
        };
      }
    }

    const getCLSScramble = function (args) {
      if (!args.length) {
        const subsets = Object.keys(clsSubsets);
        const subset = clsSubsets[subsets[rn(subsets.length)]];
        return scrambler.getCustomScramble(subset());
      } else {
        const subset = clsSubsets[args[rn(args.length)]];
        return scrambler.getCustomScramble(subset(2));
      }
    }

    return {
      initialize: scrambler.initialize,
      setRandomSrc: scrambler.setRandomSrc,
      getRandomScramble: function (args) {
        return {
          scramble_string: getCLSScramble(args)
        }
      },
      setScrambleLength: scrambler.setScrambleLength
    }
  })(base);

  register('cls', scrambler);
}

export default cls;
