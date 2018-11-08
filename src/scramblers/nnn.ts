import { Scrambler, Seed, Scramble } from '../models/Scrambler';

export class NNNScrambler implements Scrambler {
  randomSource: Seed = Math;
  mult = true;
  numcub = 1;
  cubeorient = false;
  colorString = "yobwrg";  //In dlburf order. May use any colours in colorList below

  // list of available colours
  colorList = new Array(
    'y', "yellow.jpg", "yellow",
    'b', "blue.jpg", "blue",
    'r', "red.jpg", "red",
    'w', "white.jpg", "white",
    'g', "green.jpg", "green",
    'o', "orange.jpg", "orange",
    'p', "purple.jpg", "purple",
    '0', "grey.jpg", "grey"      // used for unrecognised letters, or when zero used.
  );

  colors = new Array(); //stores colours used
  seq = new Array();  // move sequences
  posit = new Array();  // facelet array
  flat2posit = new Array(12 * this.size * this.size); //lookup table for drawing cube
  colorPerm = new Array(); //dlburf face colour permutation for each cube orientation

  constructor(public size: number, public length: number) {}

  initialize(src: Seed) {
    this.setRandomSource(src);
    this.parse();
  }

  setRandomSource(src: Seed) {
    this.randomSource = src;
  }

  setScrambleLength(length: number) {
    this.length = length;
  }

  getRandomScramble(): Scramble {
    this.scramble();
    this.imagestring(0);

    return {
      state: this.posit,
      scramble_string: this.scramblestring(0)
    }
  }

  private parse() {
    // build lookup table
    for (let i = 0; i < this.flat2posit.length; i++) this.flat2posit[i] = -1;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.flat2posit[4 * this.size * (3 * this.size - i - 1) + this.size + j] = i * this.size + j; //D
        this.flat2posit[4 * this.size * (this.size + i) + this.size - j - 1] = (this.size + i) * this.size + j; //L
        this.flat2posit[4 * this.size * (this.size + i) + 4 * this.size - j - 1] = (2 * this.size + i) * this.size + j; //B
        this.flat2posit[4 * this.size * (i) + this.size + j] = (3 * this.size + i) * this.size + j; //U
        this.flat2posit[4 * this.size * (this.size + i) + 2 * this.size + j] = (4 * this.size + i) * this.size + j; //R
        this.flat2posit[4 * this.size * (this.size + i) + this.size + j] = (5 * this.size + i) * this.size + j; //F
      }
    }

    // expand colour string into 6 actual html color names
    for (let k = 0; k < 6; k++) {
      this.colors[k] = this.colorList.length - 3; // gray
      for (let i = 0; i < this.colorList.length; i += 3) {
        if (this.colorString.charAt(k) === this.colorList[i]) {
          this.colors[k] = i;
          break;
        }
      }
    }
  }

  private appendmoves(sq: any[], axsl: any[], tl: number, la: number) {
    for (let sl = 0; sl < tl; sl++) {  // for each move type
      if (axsl[sl]) {       // if it occurs
        let q = axsl[sl] - 1;

        // get semi-axis of this move
        let sa = la;
        let m = sl;
        if (sl + sl + 1 >= tl) { // if on rear half of this axis
          sa += 3; // get semi-axis (i.e. face of the move)
          m = tl - 1 - m; // slice number counting from that face
          q = 2 - q; // opposite direction when looking at that face
        }
        // store move
        sq[sq.length] = (m * 6 + sa) * 4 + q;
      }
    }
  }

  private scramble() {
    //tl=number of allowed moves (twistable layers) on axis -- middle layer ignored
    let tl = this.size;
    if (this.mult || (this.size & 1) != 0) tl--;
    //set up bookkeeping
    const axsl = new Array(tl);    // movement of each slice/movetype on this axis
    const axam = new Array(0, 0, 0); // number of slices moved each amount
    let la; // last axis moved

    // for each cube scramble
    for (let n = 0; n < this.numcub; n++) {
      // initialise this scramble
      la = -1;
      this.seq[n] = new Array(); // moves generated so far
      // reset slice/direction counters
      for (let i = 0; i < tl; i++) axsl[i] = 0;
      axam[0] = axam[1] = axam[2] = 0;
      let moved = 0;

      // while generated sequence not long enough
      while (this.seq[n].length + moved < this.length) {

        let ax, sl, q;
        do {
          do {
            // choose a random axis
            ax = Math.floor(this.randomSource.random() * 3);
            // choose a random move type on that axis
            sl = Math.floor(this.randomSource.random() * tl);
            // choose random amount
            q = Math.floor(this.randomSource.random() * 3);
          } while (ax === la && axsl[sl] != 0);    // loop until have found an unused movetype
        } while (ax === la          // loop while move is reducible: reductions only if on same axis as previous moves
        && !this.mult        // multislice moves have no reductions so always ok
        && tl === this.size       // only even-sized cubes have reductions (odds have middle layer as reference)
          && (
            2 * axam[0] === tl ||  // reduction if already have half the slices move in same direction
            2 * axam[1] === tl ||
            2 * axam[2] === tl ||
            (
              2 * (axam[q] + 1) === tl // reduction if move makes exactly half the slices moved in same direction and
              &&
              axam[0] + axam[1] + axam[2] - axam[q] > 0 // some other slice also moved
            )
          )
        );

        // if now on different axis, dump cached moves from old axis
        if (ax != la) {
          this.appendmoves(this.seq[n], axsl, tl, la);
          // reset slice/direction counters
          for (let i = 0; i < tl; i++) axsl[i] = 0;
          axam[0] = axam[1] = axam[2] = 0;
          moved = 0;
          // remember new axis
          la = ax;
        }

        // adjust counters for this move
        axam[q]++;// adjust direction count
        moved++;
        axsl[sl] = q + 1;// mark the slice has moved amount

      }
      // dump the last few moves
      this.appendmoves(this.seq[n], axsl, tl, la);

      // do a random cube orientation if necessary
      this.seq[n][this.seq[n].length] =
        this.cubeorient ? Math.floor(this.randomSource.random() * 24) : 0;
    }
  }

  private scramblestring(n: number) {
    let s = "";
    for (let i = 0; i < this.seq[n].length - 1; i++) {
      if (i != 0) s += " ";
      let k = this.seq[n][i] >> 2;

      let j = k % 6;
      k = (k - j) / 6;
      if (k && this.size <= 5 && !this.mult) {
        s += "dlburf".charAt(j);  // use lower case only for inner slices on 4x4x4 or 5x5x5
      } else {
        if (this.size <= 5 && this.mult) {
          s += "DLBURF".charAt(j);
          if (k) s += "w"; // use w only for double layers on 4x4x4 and 5x5x5
        }
        else {
          if (k) s += (k + 1);
          s += "DLBURF".charAt(j);
        }
      }

      j = this.seq[n][i] & 3;
      if (j != 0) s += " 2'".charAt(j);
    }

    // add cube orientation
    if (this.cubeorient) {
      const ori = this.seq[n][this.seq[n].length - 1];
      s = "Top:" + this.colorList[2 + this.colors[this.colorPerm[ori][3]]]
        + "&nbsp;&nbsp;&nbsp;Front:" + this.colorList[2 + this.colors[this.colorPerm[ori][5]]] + "<br>" + s;
    }
    return s;
  }

  private imagestring(nr: number) {
    let s = "";
    let d = 0;

    // initialise colours
    for (let i = 0; i < 6; i++)
      for (let f = 0; f < this.size * this.size; f++)
        this.posit[d++] = i;

    // do move sequence
    for (let i = 0; i < this.seq[nr].length - 1; i++) {
      let q = this.seq[nr][i] & 3;
      let f = this.seq[nr][i] >> 2;
      d = 0;
      while (f > 5) { f -= 6; d++; }
      do {
        this.doslice(f, d, q + 1);
        d--;
      } while (this.mult && d >= 0);
    }

    return (s);
  }

  private doslice(f: number, d: number, q: number) {
    //do move of face f, layer d, q quarter turns
    let f1 = 0, f2 = 0, f3 = 0, f4 = 0;
    const s2 = this.size * this.size;
    if (f > 5) f -= 6;
    // cycle the side facelets
    for (let k = 0; k < q; k++) {
      for (let i = 0; i < this.size; i++) {
        if (f === 0) {
          f1 = 6 * s2 - this.size * d - this.size + i;
          f2 = 2 * s2 - this.size * d - 1 - i;
          f3 = 3 * s2 - this.size * d - 1 - i;
          f4 = 5 * s2 - this.size * d - this.size + i;
        } else if (f === 1) {
          f1 = 3 * s2 + d + this.size * i;
          f2 = 3 * s2 + d - this.size * (i + 1);
          f3 = s2 + d - this.size * (i + 1);
          f4 = 5 * s2 + d + this.size * i;
        } else if (f === 2) {
          f1 = 3 * s2 + d * this.size + i;
          f2 = 4 * s2 + this.size - 1 - d + this.size * i;
          f3 = d * this.size + this.size - 1 - i;
          f4 = 2 * s2 - 1 - d - this.size * i;
        } else if (f === 3) {
          f1 = 4 * s2 + d * this.size + this.size - 1 - i;
          f2 = 2 * s2 + d * this.size + i;
          f3 = s2 + d * this.size + i;
          f4 = 5 * s2 + d * this.size + this.size - 1 - i;
        } else if (f === 4) {
          f1 = 6 * s2 - 1 - d - this.size * i;
          f2 = this.size - 1 - d + this.size * i;
          f3 = 2 * s2 + this.size - 1 - d + this.size * i;
          f4 = 4 * s2 - 1 - d - this.size * i;
        } else if (f === 5) {
          f1 = 4 * s2 - this.size - d * this.size + i;
          f2 = 2 * s2 - this.size + d - this.size * i;
          f3 = s2 - 1 - d * this.size - i;
          f4 = 4 * s2 + d + this.size * i;
        }
        const c = this.posit[f1];
        this.posit[f1] = this.posit[f2];
        this.posit[f2] = this.posit[f3];
        this.posit[f3] = this.posit[f4];
        this.posit[f4] = c;
      }

      /* turn face */
      if (d === 0) {
        for (let i = 0; i + i < this.size; i++) {
          for (let j = 0; j + j < this.size - 1; j++) {
            f1 = f * s2 + i + j * this.size;
            f3 = f * s2 + (this.size - 1 - i) + (this.size - 1 - j) * this.size;
            if (f < 3) {
              f2 = f * s2 + (this.size - 1 - j) + i * this.size;
              f4 = f * s2 + j + (this.size - 1 - i) * this.size;
            } else {
              f4 = f * s2 + (this.size - 1 - j) + i * this.size;
              f2 = f * s2 + j + (this.size - 1 - i) * this.size;
            }
            const c = this.posit[f1];
            this.posit[f1] = this.posit[f2];
            this.posit[f2] = this.posit[f3];
            this.posit[f3] = this.posit[f4];
            this.posit[f4] = c;
          }
        }
      }
    }
  }
}
