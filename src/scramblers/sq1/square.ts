import { get8Perm } from './util';

export class Sq1Square {
  botEdgeFirst = false;
  topEdgeFirst = false;
  cornperm = 0;
  edgeperm = 0;
  SquarePrun = new Array();
  Square_TwistMove = new Array();
  Square_TopMove = new Array();
  Square_BottomMove = new Array();
  fact = [1, 1, 2, 6, 24, 120, 720, 5040];
  ml = 0;
  Cnk = new Array();

  constructor() {
    for (var i = 0; i < 12; ++i) this.Cnk[i] = [];
    this.Square_init();
  }

  Square_init() {
    var check, depth, done, find, i, idx, idxx, inv, j, m, ml, temp;
    for (i = 0; i < 12; ++i) {
      this.Cnk[i][0] = 1;
      this.Cnk[i][i] = 1;
      for (j = 1; j < i; ++j) {
        this.Cnk[i][j] = this.Cnk[i - 1][j - 1] + this.Cnk[i - 1][j];
      }
    }
    const pos: any[] = [];
    for (i = 0; i < 40320; ++i) {
      this.set8Perm(pos, i);
      temp = pos[2];
      pos[2] = pos[4];
      pos[4] = temp;
      temp = pos[3];
      pos[3] = pos[5];
      pos[5] = temp;
      this.Square_TwistMove[i] = get8Perm(pos);
      this.set8Perm(pos, i);
      temp = pos[0];
      pos[0] = pos[1];
      pos[1] = pos[2];
      pos[2] = pos[3];
      pos[3] = temp;
      this.Square_TopMove[i] = get8Perm(pos);
      this.set8Perm(pos, i);
      temp = pos[4];
      pos[4] = pos[5];
      pos[5] = pos[6];
      pos[6] = pos[7];
      pos[7] = temp;
      this.Square_BottomMove[i] = get8Perm(pos);
    }
    for (i = 0; i < 80640; ++i) {
      this.SquarePrun[i] = -1;
    }
    this.SquarePrun[0] = 0;
    depth = 0;
    done = 1;
    while (done < 80640) {
      // console.log(done);
      inv = depth >= 11;
      find = inv ? -1 : depth;
      check = inv ? depth : -1;
      ++depth;
      OUT: for (i = 0; i < 80640; ++i) {
        if (this.SquarePrun[i] == find) {
          idx = ~~i >> 1;
          ml = i & 1;
          idxx = this.Square_TwistMove[idx] << 1 | 1 - ml;
          if (this.SquarePrun[idxx] == check) {
            ++done;
            this.SquarePrun[inv ? i : idxx] = ~~(depth << 24) >> 24;
            if (inv)
              continue OUT;
          }
          idxx = idx;
          for (m = 0; m < 4; ++m) {
            idxx = this.Square_TopMove[idxx];
            if (this.SquarePrun[idxx << 1 | ml] == check) {
              ++done;
              this.SquarePrun[inv ? i : idxx << 1 | ml] = ~~(depth << 24) >> 24;
              if (inv)
                continue OUT;
            }
          }
          for (m = 0; m < 4; ++m) {
            idxx = this.Square_BottomMove[idxx];
            if (this.SquarePrun[idxx << 1 | ml] == check) {
              ++done;
              this.SquarePrun[inv ? i : idxx << 1 | ml] = ~~(depth << 24) >> 24;
              if (inv)
                continue OUT;
            }
          }
        }
      }
    }
  }

  set8Perm(arr: any[], idx: number) {
    var i, m, p, v, val;
    val = 1985229328;
    for (i = 0; i < 7; ++i) {
      p = this.fact[7 - i];
      v = ~~(idx / p);
      idx -= v * p;
      v <<= 2;
      arr[i] = ~~((~~val >> v & 7) << 24) >> 24;
      m = (1 << v) - 1;
      val = (val & m) + (~~val >> 4 & ~m);
    }
    arr[7] = ~~(val << 24) >> 24;
  }
}
