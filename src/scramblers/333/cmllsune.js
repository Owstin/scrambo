import base from './base';
import { shift } from './util/helpers';

const cmllsune = function (register) {
  const scrambler = (function (scrambler) {
    const getCMLLSuneScramble = function () {
      const s = scrambler.rn(2)+1;
      const co = shift([s,s,s,0], scrambler.rn(4));
      const cori = [0, 0, 0, co[0], co[1], co[2], co[3], 0].reverse();

      return scrambler.getCustomScramble({
        cp: [4,5,6,7],
        ep: [4,6,8,9,10,11],
        cori: parseInt(cori.join(''),3),
        eo: [0,1,2,3,5,7]
      });
    }

    return {
      initialize: scrambler.initialize,
      setRandomSrc: scrambler.setRandomSrc,
      getRandomScramble: function () {
        return {
          scramble_string: getCMLLSuneScramble()
        }
      },
      setScrambleLength: scrambler.setScrambleLength
    }
  })(base);

  register('cmllsune', scrambler);
}

export default cmllsune;
