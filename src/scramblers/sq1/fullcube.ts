import { Sq1Shape } from './shape';
import { Sq1Square } from './square';
import { get8Perm } from './util';
import { Seed } from '../../models/Scrambler';

export class Sq1FullCube {
  randomSource: Seed = Math;
  dl = 10062778;
  dr = 14536702;
  ml = 0;
  ul = 70195;
  ur = 4544119;
  arr = new Array();
  prm = new Array();

  constructor(
    public sq1Shape: Sq1Shape
  ) {}

  setRandomSource(src: Seed) {
    this.randomSource = src;
  }

  FullCube_copy(obj: any, c: any) {
    obj.ul = c.ul;
    obj.ur = c.ur;
    obj.dl = c.dl;
    obj.dr = c.dr;
    obj.ml = c.ml;
  }

  FullCube_doMove(obj: any, move: any) {
    var temp;
    move <<= 2;
    if (move > 24) {
      move = 48 - move;
      temp = obj.ul;
      obj.ul = (~~obj.ul >> move | obj.ur << 24 - move) & 16777215;
      obj.ur = (~~obj.ur >> move | temp << 24 - move) & 16777215;
    }
    else if (move > 0) {
      temp = obj.ul;
      obj.ul = (obj.ul << move | ~~obj.ur >> 24 - move) & 16777215;
      obj.ur = (obj.ur << move | ~~temp >> 24 - move) & 16777215;
    }
    else if (move == 0) {
      temp = obj.ur;
      obj.ur = obj.dl;
      obj.dl = temp;
      obj.ml = 1 - obj.ml;
    }
    else if (move >= -24) {
      move = -move;
      temp = obj.dl;
      obj.dl = (obj.dl << move | ~~obj.dr >> 24 - move) & 16777215;
      obj.dr = (obj.dr << move | ~~temp >> 24 - move) & 16777215;
    }
    else if (move < -24) {
      move = 48 + move;
      temp = obj.dl;
      obj.dl = (~~obj.dl >> move | obj.dr << 24 - move) & 16777215;
      obj.dr = (~~obj.dr >> move | temp << 24 - move) & 16777215;
    }
  }

  FullCube_getParity(obj: any) {
    var a, b, cnt, i, p;
    cnt = 0;
    obj.arr[0] = this.FullCube_pieceAt(obj, 0);
    for (i = 1; i < 24; ++i) {
      this.FullCube_pieceAt(obj, i) != obj.arr[cnt] && (obj.arr[++cnt] = this.FullCube_pieceAt(obj, i));
    }
    p = 0;
    for (a = 0; a < 16; ++a) {
      for (b = a + 1; b < 16; ++b) {
        obj.arr[a] > obj.arr[b] && (p ^= 1);
      }
    }
    return p;
  }

  FullCube_getShapeIdx(obj: any) {
    var dlx, drx, ulx, urx;
    urx = obj.ur & 1118481;
    urx |= ~~urx >> 3;
    urx |= ~~urx >> 6;
    urx = urx & 15 | ~~urx >> 12 & 48;
    ulx = obj.ul & 1118481;
    ulx |= ~~ulx >> 3;
    ulx |= ~~ulx >> 6;
    ulx = ulx & 15 | ~~ulx >> 12 & 48;
    drx = obj.dr & 1118481;
    drx |= ~~drx >> 3;
    drx |= ~~drx >> 6;
    drx = drx & 15 | ~~drx >> 12 & 48;
    dlx = obj.dl & 1118481;
    dlx |= ~~dlx >> 3;
    dlx |= ~~dlx >> 6;
    dlx = dlx & 15 | ~~dlx >> 12 & 48;
    return this.sq1Shape.Shape_getShape2Idx(this.FullCube_getParity(obj) << 24 | ulx << 18 | urx << 12 | dlx << 6 | drx);
  }

  FullCube_getSquare(obj: any, sq: Sq1Square) {
    var a, b;
    for (a = 0; a < 8; ++a) {
      obj.prm[a] = ~~(~~this.FullCube_pieceAt(obj, a * 3 + 1) >> 1 << 24) >> 24;
    }
    sq.cornperm = get8Perm(obj.prm);
    sq.topEdgeFirst = this.FullCube_pieceAt(obj, 0) == this.FullCube_pieceAt(obj, 1);
    a = sq.topEdgeFirst ? 2 : 0;
    for (b = 0; b < 4; a += 3, ++b)
      obj.prm[b] = ~~(~~this.FullCube_pieceAt(obj, a) >> 1 << 24) >> 24;
    sq.botEdgeFirst = this.FullCube_pieceAt(obj, 12) == this.FullCube_pieceAt(obj, 13);
    a = sq.botEdgeFirst ? 14 : 12;
    for (; b < 8; a += 3, ++b)
      obj.prm[b] = ~~(~~this.FullCube_pieceAt(obj, a) >> 1 << 24) >> 24;
    sq.edgeperm = get8Perm(obj.prm);
    sq.ml = obj.ml;
  }

  FullCube_pieceAt(obj: any, idx: number) {
    var ret;
    idx < 6 ? (ret = ~~obj.ul >> (5 - idx << 2)) : idx < 12 ? (ret = ~~obj.ur >> (11 - idx << 2)) : idx < 18 ? (ret = ~~obj.dl >> (17 - idx << 2)) : (ret = ~~obj.dr >> (23 - idx << 2));
    return ~~((ret & 15) << 24) >> 24;
  }

  FullCube_setPiece(obj: any, idx: number, value: any) {
    if (idx < 6) {
      obj.ul &= ~(0xf << ((5 - idx) << 2));
      obj.ul |= value << ((5 - idx) << 2);
    } else if (idx < 12) {
      obj.ur &= ~(0xf << ((11 - idx) << 2));
      obj.ur |= value << ((11 - idx) << 2);
    } else if (idx < 18) {
      obj.dl &= ~(0xf << ((17 - idx) << 2));
      obj.dl |= value << ((17 - idx) << 2);
    } else {
      obj.dr &= ~(0xf << ((23 - idx) << 2));
      obj.dr |= value << ((23 - idx) << 2);
    }
  }

  FullCube_randomCube() {
    var f, i, shape, edge, corner, n_edge, n_corner, rnd, m;
    f = this;
    shape = this.sq1Shape.Shape_ShapeIdx[~~(Math.floor(this.randomSource.random() * 3678))];
    corner = 0x01234567 << 1 | 0x11111111;
    edge = 0x01234567 << 1;
    n_corner = n_edge = 8;
    for (i = 0; i < 24; i++) {
      if (((shape >> i) & 1) == 0) {//edge
        rnd = ~~(Math.floor(this.randomSource.random() * n_edge)) << 2;
        this.FullCube_setPiece(f, 23 - i, (edge >> rnd) & 0xf);
        m = (1 << rnd) - 1;
        edge = (edge & m) + ((edge >> 4) & ~m);
        --n_edge;
      } else {//corner
        rnd = ~~(Math.floor(this.randomSource.random() * n_corner)) << 2;
        this.FullCube_setPiece(f, 23 - i, (corner >> rnd) & 0xf);
        this.FullCube_setPiece(f, 22 - i, (corner >> rnd) & 0xf);
        m = (1 << rnd) - 1;
        corner = (corner & m) + ((corner >> 4) & ~m);
        --n_corner;
        ++i;
      }
    }
    f.ml = ~~(Math.floor(this.randomSource.random() * 2));
    //	console.log(f);
    return f;
  }
}
