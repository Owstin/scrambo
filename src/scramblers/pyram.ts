import { Scrambler, Seed, Scramble } from '../models/Scrambler';

export class PyramScrambler implements Scrambler {
  private randomSource: Seed = Math;
  private numcub = 1;
  private colorString = "xgryb";  //In dlburf order. May use any colours in colorList below

  // list of available colours
  private colorList = [
    'g', "green.jpg", "green",
    'r', "red.jpg", "red",
    'y', "yellow.jpg", "yellow",
    'b', "blue.jpg", "blue",
    'w', "white.jpg", "white",
    'o', "orange.jpg", "orange",   // 'orange' is not an official html colour name
    'p', "purple.jpg", "purple",
    '0', "gray.jpg", "grey"      // used for unrecognised letters, or when zero used.
  ];

  private colmap = new Array(); // color map
  private colors = new Array() //stores colours used
  private scramblestring = new Array();

  private perm = new Array();   // pruning table for edge permutation
  private twst = new Array();   // pruning table for edge orientation+twist
  private permmv = new Array(); // transition table for edge permutation
  private twstmv = new Array(); // transition table for edge orientation+twist
  private sol = new Array();
  private pcperm = new Array();
  private pcori = new Array();

  initialize(randomSource: Seed) {
    this.setRandomSource(randomSource)
    this.parse();
    this.calcperm();
  }

  setRandomSource(randomSource: Seed) {
    this.randomSource = randomSource;
  }

  setScrambleLength() {
    return;
  }

  getRandomScramble(): Scramble {
    this.scramble();

    return {
      state: this.colmap,
      scramble_string: this.scramblestring[0],
    }
  }

  private parse() {
    // expand colour string into 6 actual html color names
    for (let k = 0; k < 6; k++) {
      this.colors[k + 1] = this.colorList.length - 3; // gray
      for (let i = 0; i < this.colorList.length; i += 3) {
        if (this.colorString.charAt(k) == this.colorList[i]) {
          this.colors[k + 1] = i; // not use index 0
          break;
        }
      }
    }
  }

  private initColors(n: number) {
    this.colmap[n] =[
      1, 1, 1, 1, 1, 0, 2, 0, 3, 3, 3, 3, 3,
      0, 1, 1, 1, 0, 2, 2, 2, 0, 3, 3, 3, 0,
      0, 0, 1, 0, 2, 2, 2, 2, 2, 0, 3, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 4, 4, 4, 4, 4, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0
    ];
  }

  private scramble() {
    for (let n = 0; n < this.numcub; n++) {
      this.initbrd();
      this.dosolve();

      this.scramblestring[n] = "";
      this.initColors(n);
      for (let i = 0; i < this.sol.length; i++) {
        this.scramblestring[n] += ["U", "L", "R", "B"][this.sol[i] & 7] + ["", "'"][(this.sol[i] & 8) / 8] + " ";
        this.picmove([3, 0, 1, 2][this.sol[i] & 7], 1 + (this.sol[i] & 8) / 8, n);
      }
      const tips = ["l", "r", "b", "u"];
      for (let i = 0; i < 4; i++) {
        const j = Math.floor(this.randomSource.random() * 3);
        if (j < 2) {
          this.scramblestring[n] += tips[i] + ["", "'"][j] + " ";
          this.picmove(4 + i, 1 + j, n);
        }
      }
    }
  }

  private initbrd() {
    this.sol.length = 0;
  }

  private dosolve() {
    let t = 0
    let q = 0;
    // Get a random permutation and orientation.
    let parity = 0;
    this.pcperm = [0, 1, 2, 3, 4, 5];
    for (let i = 0; i < 4; i++) {
      const other = i + Math.floor(this.randomSource.random() * (6 - i));
      let temp = this.pcperm[i];
      this.pcperm[i] = this.pcperm[other];
      this.pcperm[other] = temp;
      if (i != other) parity++;
    }
    if (parity % 2 == 1) {
      const temp = this.pcperm[4];
      this.pcperm[4] = this.pcperm[5];
      this.pcperm[5] = temp;
    }
    parity = 0;
    this.pcori = [];
    for (let i = 0; i < 5; i++) {
      this.pcori[i] = Math.floor(this.randomSource.random() * 2);
      parity += this.pcori[i];
    }
    this.pcori[5] = parity % 2;
    for (let i = 6; i < 10; i++) {
      this.pcori[i] = Math.floor(this.randomSource.random() * 3);
    }

    for (let a = 0; a < 6; a++) {
      let b = 0;
      for (let c = 0; c < 6; c++) {
        if (this.pcperm[c] == a) break;
        if (this.pcperm[c] > a) b++;
      }
      q = q * (6 - a) + b;
    }
    //corner orientation
    for (let a = 9; a >= 6; a--) {
      t = t * 3 + this.pcori[a];
    }
    //edge orientation
    for (let a = 4; a >= 0; a--) {
      t = t * 2 + this.pcori[a];
    }

    // solve it
    if (q != 0 || t != 0) {
      for (let l = 7; l < 12; l++) {  //allow solutions from 7 through 11 moves
        if (this.search(q, t, l, -1)) break;
      }
    }
  }

  private search(q: number, t: number, l: number, lm: number) {
    //searches for solution, from position q|t, in l moves exactly. last move was lm, current depth=d
    if (l == 0) {
      if (q == 0 && t == 0) {
        return (true);
      }
    } else {
      if (this.perm[q] > l || this.twst[t] > l) return (false);
      for (let m = 0; m < 4; m++) {
        if (m != lm) {
          let p = q;
          let s = t;
          for (let a = 0; a < 2; a++) {
            p = this.permmv[p][m];
            s = this.twstmv[s][m];
            this.sol[this.sol.length] = m + 8 * a;
            if (this.search(p, s, l - 1, m)) return (true);
            this.sol.length--;
          }
        }
      }
    }
    return (false);
  }

  private calcperm() {
    //calculate solving arrays
    //first permutation
    // initialise arrays
    for (let p = 0; p < 720; p++) {
      this.perm[p] = -1;
      this.permmv[p] = [];
      for (let m = 0; m < 4; m++) {
        this.permmv[p][m] = this.getprmmv(p, m);
      }
    }
    //fill it
    this.perm[0] = 0;
    for (let l = 0; l <= 6; l++) {
      for (let p = 0; p < 720; p++) {
        if (this.perm[p] == l) {
          for (let m = 0; m < 4; m++) {
            let q = p;
            for (let c = 0; c < 2; c++) {
              q = this.permmv[q][m];
              if (this.perm[q] == -1) { this.perm[q] = l + 1; }
            }
          }
        }
      }
    }
    //then twist
    // initialise arrays
    for (let p = 0; p < 2592; p++) {
      this.twst[p] = -1;
      this.twstmv[p] = [];
      for (let m = 0; m < 4; m++) {
        this.twstmv[p][m] = this.gettwsmv(p, m);
      }
    }
    //fill it
    this.twst[0] = 0;
    for (let l = 0; l <= 5; l++) {
      for (let p = 0; p < 2592; p++) {
        if (this.twst[p] == l) {
          for (let m = 0; m < 4; m++) {
            let q = p;
            for (let c = 0; c < 2; c++) {
              q = this.twstmv[q][m];
              if (this.twst[q] == -1) { this.twst[q] = l + 1; }
            }
          }
        }
      }
    }
  }

  private getprmmv(p: number, m: number) {
    //given position p<720 and move m<4, return new position number

    //convert number into array
    const ps = new Array<number>();
    let q = p;
    for (let a = 1; a <= 6; a++) {
      let c = Math.floor(q / a);
      let b = q - a * c;
      q = c;
      for (c = a - 1; c >= b; c--) ps[c + 1] = ps[c];
      ps[b] = 6 - a;
    }
    //perform move on array
    if (m == 0) {
      //U
      this.cycle3(ps, 0, 3, 1);
    } else if (m == 1) {
      //L
      this.cycle3(ps, 1, 5, 2);
    } else if (m == 2) {
      //R
      this.cycle3(ps, 0, 2, 4);
    } else if (m == 3) {
      //B
      this.cycle3(ps, 3, 4, 5);
    }
    //convert array back to number
    q = 0;
    for (let a = 0; a < 6; a++) {
      let b = 0;
      for (let c = 0; c < 6; c++) {
        if (ps[c] == a) break;
        if (ps[c] > a) b++;
      }
      q = q * (6 - a) + b;
    }
    return (q)
  }

  private gettwsmv(p: number, m: number) {
    //given position p<2592 and move m<4, return new position number

    //convert number into array;
    let d = 0;
    const ps = [];
    let q = p;

    //first edge orientation
    for (let a = 0; a <= 4; a++) {
      ps[a] = q & 1;
      q >>= 1;
      d ^= ps[a];
    }
    ps[5] = d;

    //next corner orientation
    for (let a = 6; a <= 9; a++) {
      let c = Math.floor(q / 3);
      let b = q - 3 * c;
      q = c;
      ps[a] = b;
    }

    //perform move on array
    if (m == 0) {
      //U
      ps[6]++; if (ps[6] == 3) ps[6] = 0;
      this.cycle3(ps, 0, 3, 1);
      ps[1] ^= 1; ps[3] ^= 1;
    } else if (m == 1) {
      //L
      ps[7]++; if (ps[7] == 3) ps[7] = 0;
      this.cycle3(ps, 1, 5, 2);
      ps[2] ^= 1; ps[5] ^= 1;
    } else if (m == 2) {
      //R
      ps[8]++; if (ps[8] == 3) ps[8] = 0;
      this.cycle3(ps, 0, 2, 4);
      ps[0] ^= 1; ps[2] ^= 1;
    } else if (m == 3) {
      //B
      ps[9]++; if (ps[9] == 3) ps[9] = 0;
      this.cycle3(ps, 3, 4, 5);
      ps[3] ^= 1; ps[4] ^= 1;
    }
    //convert array back to number
    q = 0;
    //corner orientation
    for (let a = 9; a >= 6; a--) {
      q = q * 3 + ps[a];
    }
    //corner orientation
    for (let a = 4; a >= 0; a--) {
      q = q * 2 + ps[a];
    }
    return (q);
  }

  private picmove(type: number, direction: number, n: number) {
    switch (type) {
      case 0: // L
        this.rotate3(n, 14, 58, 18, direction);
        this.rotate3(n, 15, 57, 31, direction);
        this.rotate3(n, 16, 70, 32, direction);
        this.rotate3(n, 30, 28, 56, direction);
        break;
      case 1: // R
        this.rotate3(n, 32, 72, 22, direction);
        this.rotate3(n, 33, 59, 23, direction);
        this.rotate3(n, 20, 58, 24, direction);
        this.rotate3(n, 34, 60, 36, direction);
        break;
      case 2: // B
        this.rotate3(n, 14, 10, 72, direction);
        this.rotate3(n, 1, 11, 71, direction);
        this.rotate3(n, 2, 24, 70, direction);
        this.rotate3(n, 0, 12, 84, direction);
        break;
      case 3: // U
        this.rotate3(n, 2, 18, 22, direction);
        this.rotate3(n, 3, 19, 9, direction);
        this.rotate3(n, 16, 20, 10, direction);
        this.rotate3(n, 4, 6, 8, direction);
        break;
      case 4: // l
        this.rotate3(n, 30, 28, 56, direction);
        break;
      case 5: // r
        this.rotate3(n, 34, 60, 36, direction);
        break;
      case 6: // b
        this.rotate3(n, 0, 12, 84, direction);
        break;
      case 7: // u
        this.rotate3(n, 4, 6, 8, direction);
        break;
    }
  }

  private rotate3(n: number, v1: number, v2: number, v3: number, clockwise: number) {
    if (clockwise == 2) {
      this.cycle3(this.colmap[n], v3, v2, v1);
    } else {
      this.cycle3(this.colmap[n], v1, v2, v3);
    }
  }

  private cycle3(arr: any[], i1: number, i2: number, i3: number) {
    const c = arr[i1];
    arr[i1] = arr[i2];
    arr[i2] = arr[i3];
    arr[i3] = c;
  }
}
