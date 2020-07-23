import base from './base';
import { shift, sum } from './util/helpers';

const ble = function (register) {
  const scrambler = (function (scrambler) {
    const getBLEScramble = function () {
      const ble = function () {
        const a = [0, 0, 1, scrambler.rn(3), scrambler.rn(3), scrambler.rn(3), 0, 0];
        a[6] = (3 - sum(a) % 3) % 3;
        return a;
      }

      const epa = shift([8, 9, 10, 11], scrambler.rn(4));

      return scrambler.getCustomScramble({
        cp: [4, 5, 6, 7],
        epa: [0, 1, 2, epa[0], 4, 5, 6, 7, epa[1], epa[2], epa[3], 3],
        cori: parseInt(ble().reverse().join(''), 3)
      })
    }

    return {
      initialize: scrambler.initialize,
      setRandomSrc: scrambler.setRandomSrc,
      getRandomScramble: function () {
        return {
          scramble_string: getBLEScramble()
        }
      },
      setScrambleLength: scrambler.setScrambleLength
    }
  })(base);

  register('ble', scrambler);
}

export default ble;
