import { bitCount, binarySearch } from './util';

export class Sq1Shape {
  bottom = 0;
  Shape_parity = 0;
  top = 0;
  Shape_halflayer = [0, 3, 6, 12, 15, 24, 27, 30, 48, 51, 54, 60, 63];
  Shape_ShapeIdx = new Array();
  ShapePrun = new Array();
  Shape_TopMove = new Array();
  Shape_BottomMove = new Array();
  Shape_TwistMove = new Array();

  constructor() {
    this.Shape_init()
  }

  Shape_bottomMove(obj: any) {
    var move, moveParity;
    move = 0;
    moveParity = 0;
    do {
      if ((obj.bottom & 2048) == 0) {
        move += 1;
        obj.bottom = obj.bottom << 1;
      }
      else {
        move += 2;
        obj.bottom = obj.bottom << 2 ^ 12291;
      }
      moveParity = 1 - moveParity;
    }
    while ((bitCount(obj.bottom & 63) & 1) != 0);
    (bitCount(obj.bottom) & 2) == 0 && (obj.Shape_parity ^= moveParity);
    return move;
  }

  Shape_getIdx(obj: any) {
    var ret;
    ret = binarySearch(this.Shape_ShapeIdx, obj.top << 12 | obj.bottom) << 1 | obj.Shape_parity;
    return ret;
  }

  Shape_setIdx(obj: any, idx: number) {
    obj.Shape_parity = idx & 1;
    obj.top = this.Shape_ShapeIdx[~~idx >> 1];
    obj.bottom = obj.top & 4095;
    obj.top >>= 12;
  }

  Shape_topMove(obj: any) {
    var move, moveParity;
    move = 0;
    moveParity = 0;
    do {
      if ((obj.top & 2048) == 0) {
        move += 1;
        obj.top = obj.top << 1;
      }
      else {
        move += 2;
        obj.top = obj.top << 2 ^ 12291;
      }
      moveParity = 1 - moveParity;
    }
    while ((bitCount(obj.top & 63) & 1) != 0);
    (bitCount(obj.top) & 2) == 0 && (obj.Shape_parity ^= moveParity);
    return move;
  }

  Shape_getShape2Idx(shp: any) {
    var ret;
    ret = binarySearch(this.Shape_ShapeIdx, shp & 16777215) << 1 | ~~shp >> 24;
    return ret;
  }

  Shape_init() {
    var count, depth, dl, done, done0, dr, i, idx, m, s, ul, ur, value, p1, p3, temp;
    count = 0;
    for (i = 0; i < 28561; ++i) {
      dr = this.Shape_halflayer[i % 13];
      dl = this.Shape_halflayer[~~(i / 13) % 13];
      ur = this.Shape_halflayer[~~(~~(i / 13) / 13) % 13];
      ul = this.Shape_halflayer[~~(~~(~~(i / 13) / 13) / 13)];
      value = ul << 18 | ur << 12 | dl << 6 | dr;
      bitCount(value) == 16 && (this.Shape_ShapeIdx[count++] = value);
    }
    s = this;
    for (i = 0; i < 7356; ++i) {
      this.Shape_setIdx(s, i);
      this.Shape_TopMove[i] = this.Shape_topMove(s);
      this.Shape_TopMove[i] |= this.Shape_getIdx(s) << 4;
      this.Shape_setIdx(s, i);
      this.Shape_BottomMove[i] = this.Shape_bottomMove(s);
      this.Shape_BottomMove[i] |= this.Shape_getIdx(s) << 4;
      this.Shape_setIdx(s, i);
      temp = s.top & 63;
      p1 = bitCount(temp);
      p3 = bitCount(s.bottom & 4032);
      s.Shape_parity ^= 1 & ~~(p1 & p3) >> 1;
      s.top = s.top & 4032 | ~~s.bottom >> 6 & 63;
      s.bottom = s.bottom & 63 | temp << 6;
      this.Shape_TwistMove[i] = this.Shape_getIdx(s);
    }
    for (i = 0; i < 7536; ++i) {
      this.ShapePrun[i] = -1;
    }
    this.ShapePrun[this.Shape_getShape2Idx(14378715)] = 0;
    this.ShapePrun[this.Shape_getShape2Idx(31157686)] = 0;
    this.ShapePrun[this.Shape_getShape2Idx(23967451)] = 0;
    this.ShapePrun[this.Shape_getShape2Idx(7191990)] = 0;
    done = 4;
    done0 = 0;
    depth = -1;
    while (done != done0) {
      done0 = done;
      ++depth;
      for (i = 0; i < 7536; ++i) {
        if (this.ShapePrun[i] == depth) {
          m = 0;
          idx = i;
          do {
            idx = this.Shape_TopMove[idx];
            m += idx & 15;
            idx >>= 4;
            if (this.ShapePrun[idx] == -1) {
              ++done;
              this.ShapePrun[idx] = depth + 1;
            }
          }
          while (m != 12);
          m = 0;
          idx = i;
          do {
            idx = this.Shape_BottomMove[idx];
            m += idx & 15;
            idx >>= 4;
            if (this.ShapePrun[idx] == -1) {
              ++done;
              this.ShapePrun[idx] = depth + 1;
            }
          }
          while (m != 12);
          idx = this.Shape_TwistMove[i];
          if (this.ShapePrun[idx] == -1) {
            ++done;
            this.ShapePrun[idx] = depth + 1;
          }
        }
      }
    }
  }
}
