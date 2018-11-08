import { Scrambler, Seed, Scramble } from '../models/Scrambler';

export class TwoScrambler implements Scrambler {
  private randomSource: Seed = Math;

  private posit = [
    1, 1, 1, 1,
    2, 2, 2, 2,
    5, 5, 5, 5,
    4, 4, 4, 4,
    3, 3, 3, 3,
    0, 0, 0, 0
  ];

  private piece = new Array(
    15, 16, 16, 21, 21, 15, 13, 9, 9, 17, 17, 13,
    14, 20, 20, 4, 4, 14, 12, 5, 5, 8, 8, 12,
    3, 23, 23, 18, 18, 3, 1, 19, 19, 11, 11, 1,
    2, 6, 6, 22, 22, 2, 0, 10, 10, 7, 7, 0
  );
  private adj = new Array();
  private mov2fc = new Array()
  private sol = new Array();
  private perm = new Array();
  private twst = new Array();
  private permmv = new Array()
  private twstmv = new Array();
  private size = 2;
  private seqlen = 0;
  private flat2posit = new Array(12 * this.size * this.size); //lookup table for drawing cube
  private colorPerm = new Array(); //dlburf face colour permutation for each cube orientation

  constructor() {
    this.adj[0] = new Array();
    this.adj[1] = new Array();
    this.adj[2] = new Array();
    this.adj[3] = new Array();
    this.adj[4] = new Array();
    this.adj[5] = new Array();
    this.mov2fc[0] = new Array(0, 2, 3, 1, 23, 19, 10, 6, 22, 18, 11, 7); //D
    this.mov2fc[1] = new Array(4, 6, 7, 5, 12, 20, 2, 10, 14, 22, 0, 8); //L
    this.mov2fc[2] = new Array(8, 10, 11, 9, 12, 7, 1, 17, 13, 5, 0, 19); //B
    this.mov2fc[3] = new Array(12, 13, 15, 14, 8, 17, 21, 4, 9, 16, 20, 5); //U
    this.mov2fc[4] = new Array(16, 17, 19, 18, 15, 9, 1, 23, 13, 11, 3, 21); //R
    this.mov2fc[5] = new Array(20, 21, 23, 22, 14, 16, 3, 6, 15, 18, 2, 4); //F
    this.colorPerm[0] = new Array(5, 0, 1, 4, 3, 2);
  }

  initialize(src: Seed) {
    this.setRandomSource(src);
    this.calcperm();
    this.initializeCube();
  }

  setRandomSource(src: Seed) {
    this.randomSource = src;
  }

  setScrambleLength() {
    return;
  }

  getRandomScramble(): Scramble {
    this.mix2();
    const solution = this.solve();

    return {
      state: this.posit,
      scramble_string: solution
    }
  }

  private calcadj() {
    //count all adjacent pairs (clockwise around corners)
    var a, b;
    for (a = 0; a < 6; a++)for (b = 0; b < 6; b++) this.adj[a][b] = 0;
    for (a = 0; a < 48; a += 2) {
      if (this.posit[this.piece[a]] <= 5 && this.posit[this.piece[a + 1]] <= 5)
        this.adj[this.posit[this.piece[a]]][this.posit[this.piece[a + 1]]]++;
    }
  }

  private solve() {
    this.calcadj();
    var opp = new Array();
    for (a = 0; a < 6; a++) {
      for (b = 0; b < 6; b++) {
        if (a != b && this.adj[a][b] + this.adj[b][a] === 0) { opp[a] = b; opp[b] = a; }
      }
    }
    //Each piece is determined by which of each pair of opposite colours it uses.
    var ps = new Array();
    var tws = new Array();
    var a = 0;
    for (var d = 0; d < 7; d++) {
      var p = 0;
      for (b = a; b < a + 6; b += 2) {
        if (this.posit[this.piece[b]] === this.posit[this.piece[42]]) p += 4;
        if (this.posit[this.piece[b]] === this.posit[this.piece[44]]) p += 1;
        if (this.posit[this.piece[b]] === this.posit[this.piece[46]]) p += 2;
      }
      ps[d] = p;
      if (this.posit[this.piece[a]] === this.posit[this.piece[42]] || this.posit[this.piece[a]] === opp[this.posit[this.piece[42]]]) tws[d] = 0;
      else if (this.posit[this.piece[a + 2]] === this.posit[this.piece[42]] || this.posit[this.piece[a + 2]] === opp[this.posit[this.piece[42]]]) tws[d] = 1;
      else tws[d] = 2;
      a += 6;
    }
    //convert position to numbers
    var q = 0;
    for (var a = 0; a < 7; a++) {
      var b = 0;
      for (var c = 0; c < 7; c++) {
        if (ps[c] === a) break;
        if (ps[c] > a) b++;
      }
      q = q * (7 - a) + b;
    }
    var t: number | string = 0; // this might be a problem.
    for (var a = 5; a >= 0; a--) {
      t = t * 3 + tws[a] - 3 * Math.floor(tws[a] / 3);
    }
    if (q != 0 || t != 0) {
      this.sol.length = 0;
      for (var l = this.seqlen; l < 100; l++) {
        if (this.search(0, q, t, l, -1)) break;
      }
      t = "";
      for (q = 0; q < this.sol.length; q++) {
        t = "URF".charAt(this.sol[q] / 10) + "\'2 ".charAt(this.sol[q] % 10) + " " + t;
      }
      return t;
    }
    return '';
  }

  private search(d: number, q: number, t: number, l: number, lm: number) {
    //searches for solution, from position q|t, in l moves exactly. last move was lm, current depth=d
    if (l === 0) {
      if (q === 0 && t === 0) {
        return (true);
      }
    } else {
      if (this.perm[q] > l || this.twst[t] > l) return (false);
      var p, s, a, m;
      for (m = 0; m < 3; m++) {
        if (m != lm) {
          p = q; s = t;
          for (a = 0; a < 3; a++) {
            p = this.permmv[p][m];
            s = this.twstmv[s][m];
            this.sol[d] = 10 * m + a;
            if (this.search(d + 1, p, s, l - 1, m)) return (true);
          }
        }
      }
    }
    return (false);
  }

  private calcperm() {
    //calculate solving arrays
    //first permutation

    for (var p = 0; p < 5040; p++) {
      this.perm[p] = -1;
      this.permmv[p] = new Array();
      for (var m = 0; m < 3; m++) {
        this.permmv[p][m] = this.getprmmv(p, m);
      }
    }

    this.perm[0] = 0;
    for (var l = 0; l <= 6; l++) {
      for (var p = 0; p < 5040; p++) {
        if (this.perm[p] === l) {
          for (var m = 0; m < 3; m++) {
            var q = p;
            for (var c = 0; c < 3; c++) {
              q = this.permmv[q][m];
              if (this.perm[q] === -1) { this.perm[q] = l + 1; }
            }
          }
        }
      }
    }

    //then twist
    for (var p = 0; p < 729; p++) {
      this.twst[p] = -1;
      this.twstmv[p] = new Array();
      for (var m = 0; m < 3; m++) {
        this.twstmv[p][m] = this.gettwsmv(p, m);
      }
    }

    this.twst[0] = 0;
    for (var l = 0; l <= 5; l++) {
      for (var p = 0; p < 729; p++) {
        if (this.twst[p] === l) {
          for (var m = 0; m < 3; m++) {
            var q = p;
            for (var c = 0; c < 3; c++) {
              q = this.twstmv[q][m];
              if (this.twst[q] === -1) { this.twst[q] = l + 1; }
            }
          }
        }
      }
    }
    //remove wait sign
  }

  private getprmmv(p: number, m: number) {
    //given position p<5040 and move m<3, return new position number
    var a, b, c, q;
    //convert number into array;
    var ps = new Array()
    q = p;
    for (a = 1; a <= 7; a++) {
      b = q % a;
      q = (q - b) / a;
      for (c = a - 1; c >= b; c--) ps[c + 1] = ps[c];
      ps[b] = 7 - a;
    }
    //perform move on array
    if (m === 0) {
      //U
      c = ps[0]; ps[0] = ps[1]; ps[1] = ps[3]; ps[3] = ps[2]; ps[2] = c;
    } else if (m === 1) {
      //R
      c = ps[0]; ps[0] = ps[4]; ps[4] = ps[5]; ps[5] = ps[1]; ps[1] = c;
    } else if (m === 2) {
      //F
      c = ps[0]; ps[0] = ps[2]; ps[2] = ps[6]; ps[6] = ps[4]; ps[4] = c;
    }
    //convert array back to number
    q = 0;
    for (a = 0; a < 7; a++) {
      b = 0;
      for (c = 0; c < 7; c++) {
        if (ps[c] === a) break;
        if (ps[c] > a) b++;
      }
      q = q * (7 - a) + b;
    }
    return (q)
  }

  private gettwsmv(p: number, m: number) {
    //given orientation p<729 and move m<3, return new orientation number
    var a, b, c, d, q;
    //convert number into array;
    var ps = new Array()
    q = p;
    d = 0;
    for (a = 0; a <= 5; a++) {
      c = Math.floor(q / 3);
      b = q - 3 * c;
      q = c;
      ps[a] = b;
      d -= b; if (d < 0) d += 3;
    }
    ps[6] = d;
    //perform move on array
    if (m === 0) {
      //U
      c = ps[0]; ps[0] = ps[1]; ps[1] = ps[3]; ps[3] = ps[2]; ps[2] = c;
    } else if (m === 1) {
      //R
      c = ps[0]; ps[0] = ps[4]; ps[4] = ps[5]; ps[5] = ps[1]; ps[1] = c;
      ps[0] += 2; ps[1]++; ps[5] += 2; ps[4]++;
    } else if (m === 2) {
      //F
      c = ps[0]; ps[0] = ps[2]; ps[2] = ps[6]; ps[6] = ps[4]; ps[4] = c;
      ps[2] += 2; ps[0]++; ps[4] += 2; ps[6]++;
    }
    //convert array back to number
    q = 0;
    for (a = 5; a >= 0; a--) {
      q = q * 3 + (ps[a] % 3);
    }
    return (q);
  }

  private mix2() {
    // Fixed cubie
    var fixed = 6;
    // Generate random permutation
    var perm_src = [0, 1, 2, 3, 4, 5, 6, 7];
    var perm_sel = Array();
    for (var i = 0; i < 7; i++) {
      var ch = Math.floor(this.randomSource.random() * (7 - i));
      ch = perm_src[ch] === fixed ? (ch + 1) % (8 - i) : ch;
      perm_sel[i >= fixed ? i + 1 : i] = perm_src[ch];
      perm_src[ch] = perm_src[7 - i];
    }
    perm_sel[fixed] = fixed;
    // Generate random orientation
    var total = 0;
    var ori_sel = Array();
    var i = fixed === 0 ? 1 : 0;
    for (; i < 7; i = i === fixed - 1 ? i + 2 : i + 1) {
      ori_sel[i] = Math.floor(this.randomSource.random() * 3);
      total += ori_sel[i];
    }
    if (i <= 7) ori_sel[i] = (3 - (total % 3)) % 3;
    ori_sel[fixed] = 0;

    // Convert to face format
    // Mapping from permutation/orientation to facelet
    var D = 1, L = 2, B = 5, U = 4, R = 3, F = 0;
    // D 0 1 2 3  L 4 5 6 7  B 8 9 10 11  U 12 13 14 15  R 16 17 18 19  F 20 21 22 23
    // Map from permutation/orientation to face
    var fmap = [[U, R, F], [U, B, R], [U, L, B], [U, F, L], [D, F, R], [D, R, B], [D, B, L], [D, L, F]];
    // Map from permutation/orientation to facelet identifier
    var pos = [[15, 16, 21], [13, 9, 17], [12, 5, 8], [14, 20, 4], [3, 23, 18], [1, 19, 11], [0, 10, 7], [2, 6, 22]];
    // Convert cubie representation into facelet representaion
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 3; j++)
        this.posit[pos[i][(ori_sel[i] + j) % 3]] = fmap[perm_sel[i]][j];
    }
  }

  private initializeCube() {
    var i, j;
    // build lookup table
    for (i = 0; i < this.flat2posit.length; i++) this.flat2posit[i] = -1;
    for (i = 0; i < this.size; i++) {
      for (j = 0; j < this.size; j++) {
        this.flat2posit[4 * this.size * (3 * this.size - i - 1) + this.size + j] = i * this.size + j; //D
        this.flat2posit[4 * this.size * (this.size + i) + this.size - j - 1] = (this.size + i) * this.size + j; //L
        this.flat2posit[4 * this.size * (this.size + i) + 4 * this.size - j - 1] = (2 * this.size + i) * this.size + j; //B
        this.flat2posit[4 * this.size * (i) + this.size + j] = (3 * this.size + i) * this.size + j; //U
        this.flat2posit[4 * this.size * (this.size + i) + 2 * this.size + j] = (4 * this.size + i) * this.size + j; //R
        this.flat2posit[4 * this.size * (this.size + i) + this.size + j] = (5 * this.size + i) * this.size + j; //F
      }
    }
  }
}
