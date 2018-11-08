import { Seed, Scrambler } from '../models/Scrambler';

export class ClockScrambler implements Scrambler {
  private randomSource: Seed = Math;

  initialize(src: Seed) {
    this.setRandomSource(src);
  }

  setRandomSource(src: Seed) {
    this.randomSource = src;
  };

  setScrambleLength() {
    return;
  }

  getRandomScramble() {
    const posit = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    const  p = "dU";
    const pegs = [0, 0, 0, 0];
    const seq = new Array();
    const moves = new Array();
    moves[0] = new Array(1, 1, 1, 1, 1, 1, 0, 0, 0, -1, 0, -1, 0, 0, 0, 0, 0, 0);
    moves[1] = new Array(0, 1, 1, 0, 1, 1, 0, 1, 1, -1, 0, 0, 0, 0, 0, -1, 0, 0);
    moves[2] = new Array(0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, -1, 0, -1);
    moves[3] = new Array(1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, -1, 0, 0, 0, 0, 0, -1);

    moves[4] = new Array(0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, -1, -1, -1, -1, -1, -1);
    moves[5] = new Array(1, 0, 0, 0, 0, 0, 1, 0, 0, 0, -1, -1, 0, -1, -1, 0, -1, -1);
    moves[6] = new Array(1, 0, 1, 0, 0, 0, 0, 0, 0, -1, -1, -1, -1, -1, -1, 0, 0, 0);
    moves[7] = new Array(0, 0, 1, 0, 0, 0, 0, 0, 1, -1, -1, 0, -1, -1, 0, -1, -1, 0);

    moves[8] = new Array(0, 1, 1, 1, 1, 1, 1, 1, 1, -1, 0, 0, 0, 0, 0, -1, 0, -1);
    moves[9] = new Array(1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, -1, 0, 0, 0, -1, 0, -1);
    moves[10] = new Array(1, 1, 1, 1, 1, 1, 1, 1, 0, -1, 0, -1, 0, 0, 0, 0, 0, -1);
    moves[11] = new Array(1, 1, 1, 1, 1, 1, 0, 1, 1, -1, 0, -1, 0, 0, 0, -1, 0, 0);

    moves[12] = new Array(1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 0, -1, 0, 0, 0, -1, 0, -1);
    moves[13] = new Array(1, 0, 1, 0, 0, 0, 1, 0, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1);

    for (let i = 0; i < 14; i++) {
      seq[i] = Math.floor(this.randomSource.random() * 12) - 5;
    }

    for (let i = 0; i < 4; i++) {
      pegs[i] = Math.floor(this.randomSource.random() * 2);
    }

    for (let i = 0; i < 14; i++) {
      for (let j = 0; j < 18; j++) {
        posit[j] += seq[i] * moves[i][j];
      }
    }

    for (let j = 0; j < 18; j++) {
      posit[j] %= 12;
      while (posit[j] <= 0) posit[j] += 12;
    }

    let scrambleString = "";

    const turnToString = function (turn: string, amount: number) {
      let suffix = "";
      if (amount === 0) {
        return "";
      }
      else if (amount === 1) {
        suffix = "";
      }
      else if (amount === -1) {
        suffix = "'";
      }
      else if (amount >= 0) {
        suffix = "" + amount + "";
      }
      else {
        suffix = "" + (-amount) + "'";
      }
      return " " + turn + suffix;
    }

    const addToScrambleString =
      function (pegs: string, UAmount: number, dAmount: number) {
        scrambleString += `[${pegs}]${turnToString("U", UAmount)}${turnToString("d", dAmount)} `;
      }

    addToScrambleString("UU/dd", seq[0], seq[4]);
    addToScrambleString("dU/dU", seq[1], seq[5]);
    addToScrambleString("dd/UU", seq[2], seq[6]);
    addToScrambleString("Ud/Ud", seq[3], seq[7]);
    addToScrambleString("dU/UU", seq[8], 0);
    addToScrambleString("Ud/UU", seq[9], 0);
    addToScrambleString("UU/Ud", seq[10], 0);
    addToScrambleString("UU/dU", seq[11], 0);
    addToScrambleString("UU/UU", seq[12], 0);
    addToScrambleString("dd/dd", 0, seq[13]);
    addToScrambleString(p[pegs[0]] + p[pegs[1]] + "/" + p[pegs[2]] + p[pegs[3]], 0, 0);

    return {
      state: { dials: posit, pegs: pegs },
      scramble_string: scrambleString
    };
  }
}
