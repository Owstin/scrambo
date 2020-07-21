const rn = (n) => Math.floor(randomSource.random() * n);

const clock = function (register) {
  const scrambler = (function () {
    const moveArr = [
      [0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0], //UR
      [0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0], //DR
      [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0], //DL
      [1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], //UL
      [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0], //U
      [0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0], //R
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0], //D
      [1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0], //L
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0], //ALL
      [11, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0], //UR
      [0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 1, 1, 1], //DR
      [0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 1, 1, 0, 1], //DL
      [0, 0, 11, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0], //UL
      [11, 0, 11, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0], //U
      [11, 0, 0, 0, 0, 0, 11, 0, 0, 1, 0, 1, 1, 1], //R
      [0, 0, 0, 0, 0, 0, 11, 0, 11, 0, 1, 1, 1, 1], //D
      [0, 0, 11, 0, 0, 0, 0, 0, 11, 1, 1, 1, 0, 1], //L
      [11, 0, 11, 0, 0, 0, 11, 0, 11, 1, 1, 1, 1, 1] //ALL
    ];
    
    let Cnk = [], fact = [1];
    for (let i = 0; i < 32; ++i) {
      Cnk[i] = [];
      for (let j = 0; j < 32; ++j) {
        Cnk[i][j] = 0;
      }
    }
    for (let i = 0; i < 32; ++i) {
      Cnk[i][0] = Cnk[i][i] = 1;
      fact[i + 1] = fact[i] * (i + 1);
      for (let j = 1; j < i; ++j) {
        Cnk[i][j] = Cnk[i - 1][j - 1] + Cnk[i - 1][j];
      }
    }

    const select = (n, k, idx) => {
      let r = k;
      let val = 0;
      for (let i = n - 1; i >= 0; i--) {
        if (idx >= Cnk[i][r]) {
          idx -= Cnk[i][r--];
          val |= 1 << i;
        }
      }
      return val;
    }
  
    //invert table 0  1  2  3  4  5  6  7  8  9 10 11
    const invert = [-1, 1, -1, -1, -1, 5, -1, 7, -1, -1, -1, 11];
  
    const randomState = () => {
      const ret = [];
      for (let i = 0; i < 14; i++) {
        ret[i] = rn(12);
      }
      return ret;
    }
  
    /**
     *	@return the length of the solution (the number of non-zero elements in the solution array)
     *		-1: invalid input
     */
    const Solution = (clock, solution) => {
      if (clock.length != 14 || solution.length != 18) {
        return -1;
      }
      return solveIn(14, clock, solution);
    }
  
    const swap = (arr, row1, row2) => {
      let tmp = arr[row1];
      arr[row1] = arr[row2];
      arr[row2] = tmp;
    }
  
    const addTo = (arr, row1, row2, startidx, mul) => {
      let length = arr[0].length;
      for (let i = startidx; i < length; i++) {
        arr[row2][i] = (arr[row2][i] + arr[row1][i] * mul) % 12;
      }
    }
  
    //linearly dependent
    const ld_list = [7695, 42588, 47187, 85158, 86697, 156568, 181700, 209201, 231778];
  
    const GaussianElimination = (arr) => {
      let m = 14;
      let n = arr[0].length;
      for (let i = 0; i < n - 1; i++) {
        if (invert[arr[i][i]] == -1) {
          let ivtidx = -1;
          for (let j = i + 1; j < m; j++) {
            if (invert[arr[j][i]] != -1) {
              ivtidx = j;
              break;
            }
          }
          if (ivtidx == -1) {
            OUT: for (let j1 = i; j1 < m - 1; j1++) {
              for (let j2 = j1 + 1; j2 < m; j2++) {
                if (invert[(arr[j1][i] + arr[j2][i]) % 12] != -1) {
                  addTo(arr, j2, j1, i, 1);
                  ivtidx = j1;
                  break OUT;
                }
              }
            }
          }
          if (ivtidx == -1) { //k vectors are linearly dependent
            for (let j = i + 1; j < m; j++) {
              if (arr[j][i] != 0) {
                return -1;
              }
            }
            return i + 1;
          }
          swap(arr, i, ivtidx);
        }
        let inv = invert[arr[i][i]];
        for (let j = i; j < n; j++) {
          arr[i][j] = arr[i][j] * inv % 12;
        }
        for (let j = i + 1; j < m; j++) {
          addTo(arr, i, j, i, 12 - arr[j][i]);
        }
      }
      return 0;
    }
  
    const solveIn = (k, numbers, solution) => {
      let n = 18;
      let min_nz = k + 1;
  
      for (let idx = 0; idx < Cnk[n][k]; idx++) {
        let val = select(n, k, idx);
        let isLD = false;
        for (let r = 0; r < ld_list.length; r++) {
          if ((val & ld_list[r]) == ld_list[r]) {
            isLD = true;
            break;
          }
        }
        if (isLD) {
          continue;
        }
        let map = [];
        let cnt = 0;
        for (let j = 0; j < n; j++) {
          if (((val >> j) & 1) == 1) {
            map[cnt++] = j;
          }
        }
        let arr = [];
        for (let i = 0; i < 14; i++) {
          arr[i] = [];
          for (let j = 0; j < k; j++) {
            arr[i][j] = moveArr[map[j]][i];
          }
          arr[i][k] = numbers[i];
        }
        let ret = GaussianElimination(arr);
        if (ret != 0) {
          continue;
        }
        let isSolved = true;
        for (let i = k; i < 14; i++) {
          if (arr[i][k] != 0) {
            isSolved = false;
            break;
          }
        }
        if (!isSolved) {
          continue;
        }
        backSubstitution(arr);
        let cnt_nz = 0;
        for (let i = 0; i < k; i++) {
          if (arr[i][k] != 0) {
            cnt_nz++;
          }
        }
        if (cnt_nz < min_nz) {
          for (let i = 0; i < 18; i++) {
            solution[i] = 0;
          }
          for (let i = 0; i < k; i++) {
            solution[map[i]] = arr[i][k];
          }
          min_nz = cnt_nz;
        }
      }
      return min_nz == k + 1 ? -1 : min_nz;
    }
  
    const backSubstitution = (arr) => {
      let n = arr[0].length;
      for (let i = n - 2; i > 0; i--) {
        for (let j = i - 1; j >= 0; j--) {
          if (arr[j][i] != 0) {
            addTo(arr, i, j, i, 12 - arr[j][i]);
          }
        }
      }
    }
  
    const turns = ['UR', 'DR', 'DL', 'UL', 'U', 'R', 'D', 'L', 'ALL'];
  
    const getRandomScramble = () => {
      let rndarr = randomState();
      let solution = [];
      solution.length = 18;
      Solution(rndarr, solution);
      let scramble = '';
  
      for (let x = 0; x < 9; x++) {
        let turn = solution[x];
        if (turn == 0) {
          continue;
        }
        let clockwise = turn <= 6;
        if (turn > 6) {
          turn = 12 - turn;
        }
        scramble += turns[x] + turn + (clockwise ? '+' : '-') + ' ';
      }
      scramble += 'y2 ';
      for (let x = 0; x < 9; x++) {
        let turn = solution[x + 9];
        if (turn == 0) {
          continue;
        }
        let clockwise = turn <= 6;
        if (turn > 6) {
          turn = 12 - turn;
        }
        scramble += turns[x] + turn + (clockwise ? '+' : '-') + ' ';
      }
      let isFirst = true;
      for (let x = 0; x < 4; x++) {
        if (rn(2) == 1) {
          scramble += (isFirst ? '' : ' ') + turns[x];
          isFirst = false;
        }
      }

      return {
        scramble_string: scramble,
      };
    }

    const setRandomSource = (src) => {
      randomSource = src;
    };

    return {
      /* mark2 interface */
      version: 'July 05, 2015',
      initialize: setRandomSource,
      getRandomScramble: getRandomScramble,
      setScrambleLength: function () { return; }
    };
  })();

  register('clock', scrambler);
}

module.exports = clock;
