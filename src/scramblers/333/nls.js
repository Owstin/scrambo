import base from './base';
import { CO, CP, EP } from './util/cubePositions';

const nls = function (register) {
  const scrambler = (function (scrambler) {
    const getNLSScramble = function () {
      return scrambler.getCustomScramble({
        co: [CO.FLU, CO.FRU, CO.BRU, CO.DFR],
        cp: [CP.FLU, CP.FRU, CP.BRU, CP.DFR],
        ep: [EP.UF, EP.UR, EP.FR],
      })
    }

    return {
      initialize: scrambler.initialize,
      setRandomSrc: scrambler.setRandomSrc,
      getRandomScramble: function () {
        return {
          scramble_string: getNLSScramble()
        }
      },
      setScrambleLength: scrambler.setScrambleLength
    }
  })(base);

  register('nls', scrambler);
}

export default nls;
