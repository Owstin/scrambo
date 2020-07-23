const moves = function (register) {
  const scrambler = function (moves, length) {
    let scrambleLength = length;
    let randomSrc = Math;
    const suffixes = [' ', '2', '\''];
    const rndEl = x => x[Math.floor(randomSrc.random() * x.length)];

    const initialize = function (src) {
      src && setRandomSource(src);
    }

    const setRandomSource = function (src) {
      randomSrc = src;
    }

    const setScrambleLength = function (length) {
      scrambleLength = length;
    }

    const getRandomScramble = function () {
      let scramble = '';
      const donemoves = [];

      for (let i = 0; i < 1; i++) {
        let s = '';
        let lastaxis = -1;
        for (let j = 0; j < scrambleLength; j++) {
          var done = 0;
          do {
            var first = Math.floor(randomSrc.random() * moves.length);
            var second = Math.floor(randomSrc.random() * moves[first].length);
            if (first != lastaxis) {
              for (let k = 0; k < moves[first].length; k++) {
                donemoves[k] = 0;
              }
              lastaxis = first;
            }
            if (donemoves[second] == 0) {
              donemoves[second] = 1;
              if (typeof moves[first][second] === 'array') {
                s += rndEl(moves[first][second]) + rndEl(suffixes) + ' ';
              } else {
                s += moves[first][second] + rndEl(suffixes) + ' ';
              }
              done = 1;
            }
          } while (done == 0);
        }
        scramble += s;
      }
      return scramble.trim();
    }

    return {
      initialize,
      setRandomSource,
      setScrambleLength,
      getRandomScramble: function () {
        return {
          scramble_string: getRandomScramble()
        }
      }
    }
  }

  register('lse', scrambler([['U'], ['M']], 20), ['mu']);
  register('ru', scrambler([['R'],['U']], 20));
  register('lu', scrambler([['L'],['U']], 20));
  register('rud', scrambler([['R'],['U', 'D']], 24));
  register('rul', scrambler([['R', 'L'], ['U']], 24));
}

export default moves;
