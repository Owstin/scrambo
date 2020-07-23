import base from './base';

const standard = function (register) {
  const scrambler = (function (scrambler) {
    const getRandomScramble = function () {
      return scrambler.customScramble(
        [0, 1, 2, 3, 4, 5, 6, 7],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        [0, 1, 2, 3, 4, 5, 6, 7],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      );
    }

    function getFMCScramble() {
      var scramble = "",
        axis1, axis2, axisl1, axisl2;
      do {
        scramble = getRandomScramble();
        var moveseq = scramble.split(' ');
        if (moveseq.length < 3) {
          continue;
        }
        axis1 = moveseq[0][0];
        axis2 = moveseq[1][0];
        axisl1 = moveseq[moveseq.length - 2][0];
        axisl2 = moveseq[moveseq.length - 3][0];
      } while (
        axis1 == 'F' || axis1 == 'B' && axis2 == 'F' ||
        axisl1 == 'R' || axisl1 == 'L' && axisl2 == 'R');
      return "R' U' F " + scramble + "R' U' F";
    }

    return {
      initialize: scrambler.initialize,
      setRandomSrc: scrambler.setRandomSrc,
      getRandomScramble: function () {
        return {
          scramble_string: getFMCScramble()
        }
      },
      setScrambleLength: scrambler.setScrambleLength
    }
  })(base);

  register('333fm', scrambler, ['fmc', '333fmc']);
}

export default standard;
