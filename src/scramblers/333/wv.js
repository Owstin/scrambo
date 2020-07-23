import base from './base';
import { shift, sum } from './util/helpers';

const wv = function (register) {
  const scrambler = (function (scrambler) {
    const getWVScramble = function () {
      const rn = scrambler.rn;
      const s = 0;//rn(4);

      // let cp = shift([4,5,6,7],s);
      const cpa = [0, 1, 2, 4, 5, 6, 3, 7];

      const ep = shift([8, 9, 10, 11], s);
      const epa = [0, 1, 2, ep[0], 4, 5, 6, 7, ep[1], ep[2], 3, ep[3]];

      const co = [0, 0, 0, rn(3), rn(3), 2, rn(3), 0];
      // const co = [0,0, 0, 1, 0, 0, 0, 0];
      co[2] = (3 - sum(co) % 3) % 3;
      const cori = parseInt(co.reverse().join(''), 3);

      return scrambler.getCustomScramble({ cpa, cori, epa });
    }

    return {
      initialize: scrambler.initialize,
      setRandomSrc: scrambler.setRandomSrc,
      getRandomScramble: function () {
        return {
          scramble_string: getWVScramble()
        }
      },
      setScrambleLength: scrambler.setScrambleLength
    }
  })(base);

  register('wv', scrambler);
}

export default wv;
