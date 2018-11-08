import { Sq1Square } from './square';
import { Sq1FullCube } from './fullcube';

export class Sq1Search {
  Search_c = null;
  Search_length1 = 0;
  Search_maxlen2 = 0;
  Search_sol_string = null;
  Search_move = new Array();

  constructor(
    public Search_d: Sq1FullCube,
    public Search_sq: Sq1Square
  ) {}

  Search_init2(obj: any) {
    var corner, edge, i, j, ml, prun;
    this.Search_d.FullCube_copy(obj.Search_d, obj.Search_c);
    for (i = 0; i < obj.Search_length1; ++i) {
      this.Search_d.FullCube_doMove(obj.Search_d, obj.Search_move[i]);
    }
    this.Search_d.FullCube_getSquare(obj.Search_d, obj.Search_sq);
    edge = obj.Search_sq.edgeperm;
    corner = obj.Search_sq.cornperm;
    ml = obj.Search_sq.ml;
    prun = Math.max(this.Search_sq.SquarePrun[obj.Search_sq.edgeperm << 1 | ml], this.Search_sq.SquarePrun[obj.Search_sq.cornperm << 1 | ml]);
    for (i = prun; i < obj.Search_maxlen2; ++i) {
      if (this.Search_phase2(obj, edge, corner, obj.Search_sq.topEdgeFirst, obj.Search_sq.botEdgeFirst, ml, i, obj.Search_length1, 0)) {
        for (j = 0; j < i; ++j) {
          this.Search_d.FullCube_doMove(obj.Search_d, obj.Search_move[obj.Search_length1 + j]);
          //console.log(obj.Search_move[obj.Search_length1 + j]);
        }
        //console.log(obj.Search_d);
        //console.log(obj.Search_move);
        obj.Search_sol_string = this.Search_move2string(obj, i + obj.Search_length1);
        return true;
      }
    }
    return false;
  }

  Search_move2string(obj: any, len: number) {
    var s = "";
    var top = 0, bottom = 0;
    for (var i = len - 1; i >= 0; i--) {
      var val = obj.Search_move[i];
      //console.log(val);
      if (val > 0) {
        val = 12 - val;
        top = (val > 6) ? (val - 12) : val;
      } else if (val < 0) {
        val = 12 + val
        bottom = (val > 6) ? (val - 12) : val;
      } else {
        if (top == 0 && bottom == 0) {
          s += " / "
        } else {
          s += "(" + top + ", " + bottom + ") / ";
        }
        top = bottom = 0;
      }
    }
    if (top == 0 && bottom == 0) {
    } else {
      s += "(" + top + ", " + bottom + ")";
    }
    return s;// + " (" + len + "t)";
  }

  Search_phase1(obj: any, shape: any, prunvalue: any, maxl: number, depth: number, lm: number) {
    var m, prunx, shapex;
    if (prunvalue == 0 && maxl < 4) {
      return maxl == 0 && this.Search_init2(obj);
    }
    if (lm != 0) {
      shapex = this.Search_d.sq1Shape.Shape_TwistMove[shape];
      prunx = this.Search_d.sq1Shape.ShapePrun[shapex];
      if (prunx < maxl) {
        obj.Search_move[depth] = 0;
        if (this.Search_phase1(obj, shapex, prunx, maxl - 1, depth + 1, 0)) {
          return true;
        }
      }
    }
    shapex = shape;
    if (lm <= 0) {
      m = 0;
      while (true) {
        m += this.Search_d.sq1Shape.Shape_TopMove[shapex];
        shapex = ~~m >> 4;
        m &= 15;
        if (m >= 12) {
          break;
        }
        prunx = this.Search_d.sq1Shape.ShapePrun[shapex];
        if (prunx > maxl) {
          break;
        }
        else if (prunx < maxl) {
          obj.Search_move[depth] = m;
          if (this.Search_phase1(obj, shapex, prunx, maxl - 1, depth + 1, 1)) {
            return true;
          }
        }
      }
    }
    shapex = shape;
    if (lm <= 1) {
      m = 0;
      while (true) {
        m += this.Search_d.sq1Shape.Shape_BottomMove[shapex];
        shapex = ~~m >> 4;
        m &= 15;
        if (m >= 6) {
          break;
        }
        prunx = this.Search_d.sq1Shape.ShapePrun[shapex];
        if (prunx > maxl) {
          break;
        }
        else if (prunx < maxl) {
          obj.Search_move[depth] = -m;
          if (this.Search_phase1(obj, shapex, prunx, maxl - 1, depth + 1, 2)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  Search_phase2(
    obj: any, edge: any, corner: any, topEdgeFirst: any, botEdgeFirst: any, ml: number, maxl: number, depth: number, lm: number
  ) {
    var botEdgeFirstx, cornerx, edgex, m, prun1, prun2, topEdgeFirstx;
    if (maxl == 0 && !topEdgeFirst && botEdgeFirst) {
      return true;
    }
    if (lm != 0 && topEdgeFirst == botEdgeFirst) {
      edgex = this.Search_sq.Square_TwistMove[edge];
      cornerx = this.Search_sq.Square_TwistMove[corner];
      if (this.Search_sq.SquarePrun[edgex << 1 | 1 - ml] < maxl && this.Search_sq.SquarePrun[cornerx << 1 | 1 - ml] < maxl) {
        obj.Search_move[depth] = 0;
        if (this.Search_phase2(obj, edgex, cornerx, topEdgeFirst, botEdgeFirst, 1 - ml, maxl - 1, depth + 1, 0)) {
          return true;
        }
      }
    }
    if (lm <= 0) {
      topEdgeFirstx = !topEdgeFirst;
      edgex = topEdgeFirstx ? this.Search_sq.Square_TopMove[edge] : edge;
      cornerx = topEdgeFirstx ? corner : this.Search_sq.Square_TopMove[corner];
      m = topEdgeFirstx ? 1 : 2;
      prun1 = this.Search_sq.SquarePrun[edgex << 1 | ml];
      prun2 = this.Search_sq.SquarePrun[cornerx << 1 | ml];
      while (m < 12 && prun1 <= maxl && prun1 <= maxl) {
        if (prun1 < maxl && prun2 < maxl) {
          obj.Search_move[depth] = m;
          if (this.Search_phase2(obj, edgex, cornerx, topEdgeFirstx, botEdgeFirst, ml, maxl - 1, depth + 1, 1)) {
            return true;
          }
        }
        topEdgeFirstx = !topEdgeFirstx;
        if (topEdgeFirstx) {
          edgex = this.Search_sq.Square_TopMove[edgex];
          prun1 = this.Search_sq.SquarePrun[edgex << 1 | ml];
          m += 1;
        }
        else {
          cornerx = this.Search_sq.Square_TopMove[cornerx];
          prun2 = this.Search_sq.SquarePrun[cornerx << 1 | ml];
          m += 2;
        }
      }
    }
    if (lm <= 1) {
      botEdgeFirstx = !botEdgeFirst;
      edgex = botEdgeFirstx ? this.Search_sq.Square_BottomMove[edge] : edge;
      cornerx = botEdgeFirstx ? corner : this.Search_sq.Square_BottomMove[corner];
      m = botEdgeFirstx ? 1 : 2;
      prun1 = this.Search_sq.SquarePrun[edgex << 1 | ml];
      prun2 = this.Search_sq.SquarePrun[cornerx << 1 | ml];
      while (m < (maxl > 3 ? 6 : 12) && prun1 <= maxl && prun1 <= maxl) {
        if (prun1 < maxl && prun2 < maxl) {
          obj.Search_move[depth] = -m;
          if (this.Search_phase2(obj, edgex, cornerx, topEdgeFirst, botEdgeFirstx, ml, maxl - 1, depth + 1, 2)) {
            return true;
          }
        }
        botEdgeFirstx = !botEdgeFirstx;
        if (botEdgeFirstx) {
          edgex = this.Search_sq.Square_BottomMove[edgex];
          prun1 = this.Search_sq.SquarePrun[edgex << 1 | ml];
          m += 1;
        }
        else {
          cornerx = this.Search_sq.Square_BottomMove[cornerx];
          prun2 = this.Search_sq.SquarePrun[cornerx << 1 | ml];
          m += 2;
        }
      }
    }
    return false;
  }

  Search_solution(obj: any, c: any) {
    var shape;
    obj.Search_c = c;
    shape = this.Search_d.FullCube_getShapeIdx(c);
    //console.log(shape);
    for (obj.Search_length1 = this.Search_d.sq1Shape.ShapePrun[shape]; obj.Search_length1 < 100; ++obj.Search_length1) {
      //console.log(obj.Search_length1);
      obj.Search_maxlen2 = Math.min(31 - obj.Search_length1, 17);
      if (this.Search_phase1(obj, shape, this.Search_d.sq1Shape.ShapePrun[shape], obj.Search_length1, 0, -1)) {
        break;
      }
    }
    return obj.Search_sol_string;
  }
}

