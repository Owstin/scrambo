/*
 * 333.js
 *
 * 3x3x3 Solver / Scramble Generator in Javascript.
 *
 * The core 3x3x3 code is from a min2phase solver by Shuang Chen.
 * Compiled to Javascript using GWT.
 * (There may be a lot of redundant code right now, but it's still really fast.)
 *
 * rewritten for es6 and documented by Caleb Hoover;
 *
 */
const { swap, createArray } = require('./util/helpers');
const { coSubsets } = require('./util/coSubsets');

var scrambler = (function () {
  var _;
  const nullMethod = () => { };

  function $clinit_CoordCube() {
    $clinit_CoordCube = nullMethod;
    UDSliceMove = createArray(495, 18);
    TwistMove = createArray(324, 18);
    FlipMove = createArray(336, 18);
    UDSliceConj = createArray(495, 8);
    UDSliceTwistPrun = Array(160380);
    UDSliceFlipPrun = Array(166320);
    TwistFlipPrun = Array(870912);
    Mid3Move = createArray(1320, 18);
    Mid32MPerm = Array(24);
    CParity = Array(346);
    CPermMove = createArray(2768, 18);
    EPermMove = createArray(2768, 10);
    MPermMove = createArray(24, 10);
    MPermConj = createArray(24, 16);
    MCPermPrun = Array(66432);
    MEPermPrun = Array(66432);
  }

  /* Init Stuff: */

  function initCParity() {
    for (let i = 0; i < 346; ++i) {
      CParity[i] = 0;
    }

    for (let i = 0; i < 2768; ++i) {
      CParity[i >>> 3] = (CParity[i >>> 3] | get8Parity((CPermS2R)[i]) << (i & 7));
    }
  }

  function initCPermMove() {
    let c = new CubieCube_0;
    let d = new CubieCube_0;
    for (let i = 0; i < 2768; ++i) {
      set8Perm(c.cp, (CPermS2R)[i]);
      for (let j = 0; j < 18; ++j) {
        CornMult(c, moveCube[j], d);
        CPermMove[i][j] = $getCPermSym(d);
      }
    }
  }

  function initEPermMove() {
    let c = new CubieCube_0;
    let d = new CubieCube_0;
    for (let i = 0; i < 2768; ++i) {
      set8Perm(c.ep, (EPermS2R)[i]);
      for (let j = 0; j < 10; ++j) {
        EdgeMult(c, moveCube[ud2std[j]], d);
        EPermMove[i][j] = $getEPermSym(d);
      }
    }
  }

  function initFlipMove() {
    let c = new CubieCube_0;
    let d = new CubieCube_0;
    for (let i = 0; i < 336; ++i) {
      $setFlip(c, (FlipS2R)[i]);
      for (let j = 0; j < 18; ++j) {
        EdgeMult(c, moveCube[j], d);
        FlipMove[i][j] = $getFlipSym(d);
      }
    }
  }

  function initMCEPermPrun(callback) {
    let check, corn, cornx, edge, edgex, i, idx, idxx, inv, j, m_0, mid, midx, select, sym, symx;
    let c = new CubieCube_0;
    let d = new CubieCube_0;
    let depth = 0;
    let done = 1;
    let SymState = Array(2768);
    for (i = 0; i < 2768; ++i) {
      SymState[i] = 0;
      set8Perm(c.ep, (EPermS2R)[i]);
      for (j = 1; j < 16; ++j) {
        EdgeMult(CubeSym[SymInv[j]], c, temp_0);
        EdgeMult(temp_0, CubeSym[j], d);
        binarySearch(EPermS2R, get8Perm(d.ep)) != 65535 && (SymState[i] = (SymState[i] | 1 << j));
      }
    }
    for (i = 0; i < 66432; ++i) {
      MEPermPrun[i] = -1;
    }
    MEPermPrun[0] = 0;
    while (done < 66432) {
      inv = depth > 7;
      select = inv ? -1 : depth;
      check = inv ? depth : -1;
      ++depth;
      for (i = 0; i < 66432; ++i) {
        if (MEPermPrun[i] === select) {
          mid = i % 24;
          edge = ~~(i / 24);
          for (m_0 = 0; m_0 < 10; ++m_0) {
            edgex = EPermMove[edge][m_0];
            symx = edgex & 15;
            midx = MPermConj[MPermMove[mid][m_0]][symx];
            edgex >>>= 4;
            idx = edgex * 24 + midx;
            if (MEPermPrun[idx] === check) {
              ++done;
              if (inv) {
                MEPermPrun[i] = depth;
                break;
              }
              else {
                MEPermPrun[idx] = depth;
                sym = SymState[edgex];
                if (sym != 0) {
                  for (j = 1; j < 16; ++j) {
                    sym = sym >> 1;
                    if ((sym & 1) === 1) {
                      idxx = edgex * 24 + MPermConj[midx][j];
                      if (MEPermPrun[idxx] === -1) {
                        MEPermPrun[idxx] = depth;
                        ++done;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      callback("MEPermPrun: " + (Math.floor(done * 100 / 66432)) + "% (" + done + "/66432)");
    }
    for (i = 0; i < 66432; ++i) {
      MCPermPrun[i] = -1;
    }
    MCPermPrun[0] = 0;
    depth = 0;
    done = 1;
    while (done < 66432) {
      inv = depth > 7;
      select = inv ? -1 : depth;
      check = inv ? depth : -1;
      ++depth;
      for (i = 0; i < 66432; ++i) {
        if (MCPermPrun[i] === select) {
          mid = i % 24;
          corn = ~~(i / 24);
          for (m_0 = 0; m_0 < 10; ++m_0) {
            cornx = CPermMove[corn][ud2std[m_0]];
            symx = (cornx & 15);
            midx = MPermConj[MPermMove[mid][m_0]][symx];
            cornx = cornx >>> 4;
            idx = cornx * 24 + midx;
            if (MCPermPrun[idx] === check) {
              ++done;
              if (inv) {
                MCPermPrun[i] = depth;
                break;
              }
              else {
                MCPermPrun[idx] = depth;
                sym = SymState[cornx];
                if (sym != 0) {
                  for (j = 1; j < 16; ++j) {
                    sym = sym >> 1;
                    if ((sym & 1) === 1) {
                      idxx = cornx * 24 + MPermConj[midx][j ^ (e2c)[j]];
                      if (MCPermPrun[idxx] === -1) {
                        MCPermPrun[idxx] = depth;
                        ++done;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      callback("MCPermPrun: " + (Math.floor(done * 100 / 66432)) + "% (" + done + "/66432)");
    }
  }

  function initMPermConj() {
    let c = new CubieCube_0;
    let d = new CubieCube_0;
    for (let i = 0; i < 24; ++i) {
      $setMPerm(c, i);
      for (let j = 0; j < 16; ++j) {
        EdgeConjugate(c, SymInv[j], d);
        MPermConj[i][j] = $getMPerm(d);
      }
    }
  }

  function initMPermMove() {
    let c = new CubieCube_0;
    let d = new CubieCube_0;
    for (let i = 0; i < 24; ++i) {
      $setMPerm(c, i);
      for (let j = 0; j < 10; ++j) {
        EdgeMult(c, moveCube[ud2std[j]], d);
        MPermMove[i][j] = $getMPerm(d);
      }
    }
  }

  function initMid32MPerm() {
    var c, i;
    c = new CubieCube_0;
    for (i = 0; i < 24; ++i) {
      $setMPerm(c, i);
      Mid32MPerm[$getMid3(c) % 24] = i;
    }
  }

  function initMid3Move() {
    let c = new CubieCube_0;
    let d = new CubieCube_0;
    for (let i = 0; i < 1320; ++i) {
      $setMid3(c, i);
      for (let j = 0; j < 18; ++j) {
        EdgeMult(c, moveCube[j], d);
        Mid3Move[i][j] = $getMid3(d);
      }
    }
  }



  function initTwistFlipSlicePrun(callback) {
    var SymState, SymStateF, c, check, d, depth, done, flip, flipx, fsym, fsymx, fsymxx, i, idx, idxx, inv, j, k, m_0, select, slice, slicex, sym, symF, symx, tsymx, twist, twistx;
    SymState = Array(324);
    c = new CubieCube_0;
    d = new CubieCube_0;
    for (i = 0; i < 324; ++i) {
      SymState[i] = 0;
      $setTwist(c, TwistS2R[i]);
      for (j = 0; j < 8; ++j) {
        CornMultSym(CubeSym[SymInv[j << 1]], c, temp_0);
        CornMultSym(temp_0, CubeSym[j << 1], d);
        binarySearch(TwistS2R, $getTwist(d)) != 65535 && (SymState[i] = SymState[i] | (1 << j));
      }
    }
    SymStateF = Array(336);
    for (i = 0; i < 336; ++i) {
      SymStateF[i] = 0;
      $setFlip(c, (FlipS2R)[i]);
      for (j = 0; j < 8; ++j) {
        EdgeMult(CubeSym[SymInv[j << 1]], c, temp_0);
        EdgeMult(temp_0, CubeSym[j << 1], d);
        binarySearch(FlipS2R, $getFlip(d)) != 65535 && (SymStateF[i] = SymStateF[i] | (1 << j));
      }
    }
    for (i = 0; i < 870912; ++i) {
      TwistFlipPrun[i] = -1;
    }
    for (i = 0; i < 8; ++i) {
      TwistFlipPrun[i] = 0;
    }
    depth = 0;
    done = 8;
    while (done < 870912) {
      inv = depth > 6;
      select = inv ? -1 : depth;
      check = inv ? depth : -1;
      ++depth;
      for (i = 0; i < 870912; ++i) {
        if (TwistFlipPrun[i] != select)
          continue;
        twist = ~~(i / 2688);
        flip = i % 2688;
        fsym = i & 7;
        flip >>>= 3;
        for (m_0 = 0; m_0 < 18; ++m_0) {
          twistx = TwistMove[twist][m_0];
          tsymx = twistx & 7;
          twistx >>>= 3;
          flipx = FlipMove[flip][Sym8Move[fsym][m_0]];
          fsymx = Sym8MultInv[Sym8Mult[flipx & 7][fsym]][tsymx];
          flipx >>>= 3;
          idx = twistx * 2688 + (flipx << 3 | fsymx);
          if (TwistFlipPrun[idx] === check) {
            ++done;
            if (inv) {
              TwistFlipPrun[i] = depth;
              break;
            }
            else {
              TwistFlipPrun[idx] = depth;
              sym = SymState[twistx];
              symF = SymStateF[flipx];
              if (sym != 1 || symF != 1) {
                for (j = 0; j < 8; ++j, symF = symF >> 1) {
                  if ((symF & 1) === 1) {
                    fsymxx = Sym8MultInv[fsymx][j];
                    for (k = 0; k < 8; ++k) {
                      if ((sym & 1 << k) != 0) {
                        idxx = twistx * 2688 + (flipx << 3 | Sym8MultInv[fsymxx][k]);
                        if (TwistFlipPrun[idxx] === -1) {
                          TwistFlipPrun[idxx] = depth;
                          ++done;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      callback("TwistFlipPrun: " + (Math.floor(done * 100 / 870912)) + "% (" + done + "/870912)");
    }
    for (i = 0; i < 160380; ++i) {
      UDSliceTwistPrun[i] = -1;
    }
    UDSliceTwistPrun[0] = 0;
    depth = 0;
    done = 1;
    while (done < 160380) {
      inv = depth > 6;
      select = inv ? -1 : depth;
      check = inv ? depth : -1;
      ++depth;
      for (i = 0; i < 160380; ++i) {
        if (UDSliceTwistPrun[i] === select) {
          slice = i % 495;
          twist = ~~(i / 495);
          for (m_0 = 0; m_0 < 18; ++m_0) {
            twistx = TwistMove[twist][m_0];
            symx = twistx & 7;
            slicex = UDSliceConj[UDSliceMove[slice][m_0]][symx];
            twistx >>>= 3;
            idx = twistx * 495 + slicex;
            if (UDSliceTwistPrun[idx] === check) {
              ++done;
              if (inv) {
                UDSliceTwistPrun[i] = depth;
                break;
              }
              else {
                UDSliceTwistPrun[idx] = depth;
                sym = SymState[twistx];
                if (sym != 1) {
                  for (j = 1; j < 8; ++j) {
                    sym = sym >> 1;
                    if ((sym & 1) === 1) {
                      idxx = twistx * 495 + UDSliceConj[slicex][j];
                      if (UDSliceTwistPrun[idxx] === -1) {
                        UDSliceTwistPrun[idxx] = depth;
                        ++done;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      callback("UDSliceTwistPrun: " + (Math.floor(done * 100 / 160380)) + "% (" + done + "/160380)");
    }
    for (i = 0; i < 166320; ++i) {
      UDSliceFlipPrun[i] = -1;
    }
    UDSliceFlipPrun[0] = 0;
    depth = 0;
    done = 1;
    while (done < 166320) {
      inv = depth > 6;
      select = inv ? -1 : depth;
      check = inv ? depth : -1;
      ++depth;
      for (i = 0; i < 166320; ++i) {
        if (UDSliceFlipPrun[i] === select) {
          slice = i % 495;
          flip = ~~(i / 495);
          for (m_0 = 0; m_0 < 18; ++m_0) {
            flipx = FlipMove[flip][m_0];
            symx = flipx & 7;
            slicex = UDSliceConj[UDSliceMove[slice][m_0]][symx];
            flipx >>>= 3;
            idx = flipx * 495 + slicex;
            if (UDSliceFlipPrun[idx] === check) {
              ++done;
              if (inv) {
                UDSliceFlipPrun[i] = depth;
                break;
              }
              else {
                UDSliceFlipPrun[idx] = depth;
                sym = SymStateF[flipx];
                if (sym != 1) {
                  for (j = 1; j < 8; ++j) {
                    sym = sym >> 1;
                    if ((sym & 1) === 1) {
                      idxx = flipx * 495 + UDSliceConj[slicex][j];
                      if (UDSliceFlipPrun[idxx] === -1) {
                        UDSliceFlipPrun[idxx] = depth;
                        ++done;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      callback("UDSliceFlipPrun: " + (Math.floor(done * 100 / 166320)) + "% (" + done + "/166320)");
    }
  }

  function initTwistMove() {
    let c = new CubieCube_0;
    let d = new CubieCube_0;
    for (let i = 0; i < 324; ++i) {
      $setTwist(c, TwistS2R[i]);
      for (let j = 0; j < 18; ++j) {
        CornMult(c, moveCube[j], d);
        TwistMove[i][j] = $getTwistSym(d);
      }
    }
  }

  function initUDSliceConj() {
    let c = new CubieCube_0;
    let d = new CubieCube_0;
    for (let i = 0; i < 495; ++i) {
      $setUDSlice(c, i);
      for (let j = 0; j < 16; j = j + 2) {
        EdgeConjugate(c, (SymInv)[j], d);
        UDSliceConj[i][j >>> 1] = $getUDSlice(d);
      }
    }
  }

  function initUDSliceMove() {
    let c = new CubieCube_0;
    let d = new CubieCube_0;
    for (let i = 0; i < 495; ++i) {
      $setUDSlice(c, i);
      for (let j = 0; j < 18; ++j) {
        EdgeMult(c, moveCube[j], d);
        UDSliceMove[i][j] = $getUDSlice(d);
      }
    }
  }

  var CParity, CPermMove, EPermMove, FlipMove, MCPermPrun, MEPermPrun, MPermConj, MPermMove, Mid32MPerm, Mid3Move, TwistFlipPrun, TwistMove, UDSliceConj, UDSliceFlipPrun, UDSliceMove, UDSliceTwistPrun;
  function $clinit_CubieCube() {
    $clinit_CubieCube = nullMethod;
    temp_0 = new CubieCube_0;
    CubeSym = Array(16);
    SymInv = Array(16);
    SymMult = createArray(16, 16);
    SymMove = createArray(16, 18);
    Sym8Mult = createArray(8, 8);
    Sym8Move = createArray(8, 18);
    Sym8MultInv = createArray(8, 8);
    SymMoveUD = createArray(16, 10);
    FlipS2R = Array(336);
    TwistS2R = Array(324);
    CPermS2R = Array(2768);
    EPermS2R = CPermS2R;
    MtoEPerm = Array(40320);
    merge = createArray(56, 56);
    e2c = [0, 0, 0, 0, 1, 3, 1, 3, 1, 3, 1, 3, 0, 0, 0, 0];
    urf1 = new CubieCube_2(2531, 1373, 67026819, 1877);
    urf2 = new CubieCube_2(2089, 1906, 322752913, 255);
    urfMove = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
      [6, 7, 8, 0, 1, 2, 3, 4, 5, 15, 16, 17, 9, 10, 11, 12, 13, 14],
      [3, 4, 5, 6, 7, 8, 0, 1, 2, 12, 13, 14, 15, 16, 17, 9, 10, 11],
      [2, 1, 0, 5, 4, 3, 8, 7, 6, 11, 10, 9, 14, 13, 12, 17, 16, 15],
      [8, 7, 6, 2, 1, 0, 5, 4, 3, 17, 16, 15, 11, 10, 9, 14, 13, 12],
      [5, 4, 3, 8, 7, 6, 2, 1, 0, 14, 13, 12, 17, 16, 15, 11, 10, 9]
    ];
    initMove();
    initSym();
  }

  function $$init(cube) {
    cube.cp = [0, 1, 2, 3, 4, 5, 6, 7];
    cube.co = [0, 0, 0, 0, 0, 0, 0, 0];
    cube.ep = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    cube.eo = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  }

  function $copy(cube, c) {
    cube.cp = c.cp.map(v => v);
    cube.co = c.co.map(v => v);
    cube.ep = c.ep.map(v => v);
    cube.eo = c.eo.map(v => v);
  }

  function $getCPermSym(cube) {
    var idx, k;
    if (EPermR2S != null) {
      idx = EPermR2S[get8Perm(cube.cp)];
      idx = (idx ^ e2c[idx & 15]);
      return idx;
    }
    for (k = 0; k < 16; ++k) {
      CornConjugate(cube, SymInv[k], cube.temps);
      idx = binarySearch(CPermS2R, get8Perm(cube.temps.cp));
      if (idx != 65535) {
        return (idx << 4 | k);
      }
    }
    return 0;
  }

  function $getDRtoDL(cube) {
    var i, idxA, idxB, mask, r, t;
    idxA = 0;
    idxB = 0;
    mask = 0;
    r = 3;
    for (i = 11; i >= 0; --i) {
      if (4 <= cube.ep[i] && cube.ep[i] <= 6) {
        idxA = idxA + (Cnk)[i][r--];
        t = 1 << cube.ep[i];
        idxB = idxB + bitCount(mask & t - 1) * fact[2 - r];
        mask = (mask | t);
      }
    }
    return idxA * 6 + idxB;
  }

  function $getEPermSym(cube) {
    var idx, k;
    if (EPermR2S != null) {
      return EPermR2S[get8Perm(cube.ep)];
    }
    for (k = 0; k < 16; ++k) {
      EdgeConjugate(cube, SymInv[k], cube.temps);
      idx = binarySearch(EPermS2R, get8Perm(cube.temps.ep));
      if (idx != 65535) {
        return (idx << 4 | k);
      }
    }
    return 0;
  }

  function $getEdgePerm(cube) {
    var i, idx, m_0, t;
    m_0 = 1 << cube.ep[11];
    idx = 0;
    for (i = 10; i >= 0; --i) {
      t = 1 << cube.ep[i];
      idx += bitCount(m_0 & t - 1) * (fact)[11 - i];
      m_0 |= t;
    }
    return idx;
  }

  function $getFlip(cube) {
    var i, idx;
    idx = 0;
    for (i = 0; i < 11; ++i) {
      idx = (idx | cube.eo[i] << i);
    }
    return idx;
  }

  function $getFlipSym(cube) {
    var idx, k;
    if (FlipR2S != null) {
      return FlipR2S[$getFlip(cube)];
    }
    for (k = 0; k < 16; k = k + 2) {
      EdgeConjugate(cube, SymInv[k], cube.temps);
      idx = binarySearch(FlipS2R, $getFlip(cube.temps));
      if (idx != 65535) {
        return (idx << 3 | k >>> 1);
      }
    }
    return 0;
  }

  function $getMPerm(cube) {
    var i, idx, m_0, t;
    m_0 = 1 << cube.ep[11];
    idx = 0;
    for (i = 10; i >= 8; --i) {
      t = 1 << cube.ep[i];
      idx += bitCount(m_0 & t - 1) * (fact)[11 - i];
      m_0 |= t;
    }
    return idx;
  }

  function $getMid3(cube) {
    var i, idxA, idxB, mask, r, t;
    idxA = 0;
    idxB = 0;
    mask = 0;
    r = 3;
    for (i = 11; i >= 0; --i) {
      if (cube.ep[i] >= 9) {
        idxA = idxA + (Cnk)[i][r--];
        t = 1 << cube.ep[i];
        idxB = idxB + bitCount(mask & t - 1) * fact[2 - r];
        mask = (mask | t);
      }
    }
    return idxA * 6 + idxB;
  }

  function $getTwist(cube) {
    var i, idx;
    idx = 0;
    for (i = 0; i < 7; ++i) {
      idx = idx * 3;
      idx = idx + cube.co[i];
    }
    return idx;
  }

  function $getTwistSym(cube) {
    var idx, k;
    if (TwistR2S != null) {
      return TwistR2S[$getTwist(cube)];
    }
    for (k = 0; k < 16; k = k + 2) {
      CornConjugate(cube, SymInv[k], cube.temps);
      idx = $getTwist(cube.temps);
      idx = binarySearch(TwistS2R, idx);
      if (idx != 65535) {
        return (idx << 3 | k >>> 1);
      }
    }
    return 0;
  }

  function $getUDSlice(cube) {
    var i, idx, r;
    idx = 0;
    r = 4;
    for (i = 0; i < 12; ++i) {
      cube.ep[i] >= 8 && (idx = idx + (Cnk)[11 - i][r--]);
    }
    return idx;
  }

  function $getURtoUL(cube) {
    var i, idxA, idxB, mask, r, t;
    idxA = 0;
    idxB = 0;
    mask = 0;
    r = 3;
    for (i = 11; i >= 0; --i) {
      if (cube.ep[i] <= 2) {
        idxA = idxA + (Cnk)[i][r--];
        t = 1 << cube.ep[i];
        idxB = idxB + bitCount(mask & t - 1) * fact[2 - r];
        mask = (mask | t);
      }
    }
    return idxA * 6 + idxB;
  }

  function $invCubieCube(cube) {
    var corn, edge, ori;
    for (edge = 0; edge < 12; ++edge)
      cube.temps.ep[cube.ep[edge]] = edge;
    for (edge = 0; edge < 12; ++edge)
      cube.temps.eo[edge] = cube.eo[cube.temps.ep[edge]];
    for (corn = 0; corn < 8; ++corn)
      cube.temps.cp[cube.cp[corn]] = corn;
    for (corn = 0; corn < 8; ++corn) {
      ori = cube.co[cube.temps.cp[corn]];
      cube.temps.co[corn] = -ori;
      cube.temps.co[corn] < 0 && (cube.temps.co[corn] = cube.temps.co[corn] + 3);
    }
    $copy(cube, cube.temps);
  }

  function $setEdgePerm(cube, idx) {
    cube.ep[11] = 0;
    for (let i = 10; i >= 0; --i) {
      cube.ep[i] = idx % (12 - i);
      idx = ~~(idx / (12 - i));
      for (let j = i + 1; j < 12; ++j) {
        cube.ep[j] >= cube.ep[i] && ++cube.ep[j];
      }
    }
  }

  function $setFlip(cube, idx) {
    cube.eo[11] = bitOdd(idx);
    for (let i = 0; i < 11; ++i) {
      cube.eo[i] = (idx & 1);
      idx = idx >>> 1;
    }
  }

  function $setMPerm(cube, idx) {
    cube.ep[11] = 8;
    for (let i = 10; i >= 8; --i) {
      cube.ep[i] = idx % (12 - i) + 8;
      idx = ~~(idx / (12 - i));
      for (let j = i + 1; j < 12; ++j) {
        cube.ep[j] >= cube.ep[i] && ++cube.ep[j];
      }
    }
  }

  function $setMid3(cube, idxA) {
    let edge = (perm3)[idxA % 6];
    idxA = ~~(idxA / 6);
    let r = 3;
    for (let i = 11; i >= 0; --i) {
      if (idxA >= Cnk[i][r]) {
        idxA = idxA - Cnk[i][r--];
        cube.ep[i] = edge[2 - r];
      }
      else {
        cube.ep[i] = 8 - i + r;
      }
    }
  }

  function $setTwist(cube, idx) {
    let twst = 0;
    for (let i = 6; i >= 0; --i) {
      twst = twst + (cube.co[i] = idx % 3);
      idx = ~~(idx / 3);
    }
    cube.co[7] = (15 - twst) % 3;
  }

  function $setUDSlice(cube, idx) {
    let r = 4;
    for (let i = 0; i < 12; ++i) {
      if (idx >= (Cnk)[11 - i][r]) {
        idx = idx - Cnk[11 - i][r--];
        cube.ep[i] = 11 - r;
      }
      else {
        cube.ep[i] = i + r - 4;
      }
    }
  }

  function $verify(cube) {
    let sum = 0;
    let edgeMask = 0;
    for (let e = 0; e < 12; ++e)
      edgeMask = (edgeMask | 1 << cube.ep[e]);
    if (edgeMask != 4095)
      return -2;
    for (let i = 0; i < 12; ++i)
      sum = sum ^ cube.eo[i];
    if (sum % 2 != 0)
      return -3;

    let cornMask = 0;
    for (let c = 0; c < 8; ++c)
      cornMask = (cornMask | 1 << cube.cp[c]);
    if (cornMask != 255)
      return -4;
    sum = 0;
    for (let i = 0; i < 8; ++i)
      sum = sum + cube.co[i];
    if (sum % 3 != 0)
      return -5;
    if ((get12Parity($getEdgePerm(cube)) ^ get8Parity(get8Perm(cube.cp))) != 0)
      return -6;
    return 0;
  }

  function CornConjugate(a, idx, b) {
    CornMultSym(CubeSym[SymInv[idx]], a, temp_0);
    CornMultSym(temp_0, CubeSym[idx], b);
  }

  function CornMult(a, b, prod) {
    for (let corn = 0; corn < 8; ++corn) {
      prod.cp[corn] = a.cp[b.cp[corn]];
      prod.co[corn] = (a.co[b.cp[corn]] + b.co[corn]) % 3;
    }
  }

  function CornMultSym(a, b, prod) {
    let ori, oriA, oriB;
    for (let corn = 0; corn < 8; ++corn) {
      prod.cp[corn] = a.cp[b.cp[corn]];
      oriA = a.co[b.cp[corn]];
      oriB = b.co[corn];
      ori = oriA;
      ori = ori + (oriA < 3 ? oriB : 3 - oriB);
      ori = ori % 3;
      oriA < 3 ^ oriB < 3 && (ori = ori + 3);
      prod.co[corn] = ori;
    }
  }

  function CubieCube_0() {
    $$init(this);
  }

  function CubieCube_1(cp, co, ep, eo) {
    $$init(this);
    for (let i = 0; i < 8; ++i) {
      this.cp[i] = cp[i];
      this.co[i] = co[i];
    }
    for (let i = 0; i < 12; ++i) {
      this.ep[i] = ep[i];
      this.eo[i] = eo[i];
    }
  }

  function CubieCube_2(cperm, twist, eperm, flip) {
    $$init(this);
    set8Perm(this.cp, cperm);
    $setTwist(this, twist);
    $setEdgePerm(this, eperm);
    $setFlip(this, flip);
  }

  function CubieCube_3(c) {
    CubieCube_1.call(this, c.cp, c.co, c.ep, c.eo);
  }

  function EdgeConjugate(a, idx, b) {
    EdgeMult(CubeSym[SymInv[idx]], a, temp_0);
    EdgeMult(temp_0, CubeSym[idx], b);
  }

  function EdgeMult(a, b, prod) {
    var ed;
    for (ed = 0; ed < 12; ++ed) {
      prod.ep[ed] = a.ep[b.ep[ed]];
      prod.eo[ed] = (b.eo[ed] ^ a.eo[b.ep[ed]]);
    }
  }

  function get8Perm(arr) {
    var i, idx, v, val;
    idx = 0;
    val = 1985229328;
    for (i = 0; i < 7; ++i) {
      v = arr[i] << 2;
      idx = (8 - i) * idx + (val >> v & 7);
      val -= 286331152 << v;
    }
    return idx;
  }

  function initMove() {
    var m_0, mc, p;
    mc = Array(18);
    moveCube = [new CubieCube_2(15120, 0, 119750400, 0), new CubieCube_2(21021, 1494, 323403417, 0), new CubieCube_2(8064, 1236, 29441808, 802), new CubieCube_2(9, 0, 5880, 0), new CubieCube_2(1230, 412, 2949660, 0), new CubieCube_2(224, 137, 328552, 1160)];
    for (m_0 = 0; m_0 < 6; ++m_0) {
      mc[m_0 * 3] = moveCube[m_0];
      for (p = 0; p < 2; ++p) {
        mc[m_0 * 3 + p + 1] = new CubieCube_0;
        EdgeMult(mc[m_0 * 3 + p], moveCube[m_0], mc[m_0 * 3 + p + 1]);
        CornMult(mc[m_0 * 3 + p], moveCube[m_0], mc[m_0 * 3 + p + 1]);
      }
    }
    moveCube = mc;
  }

  function initSym() {
    var c, d, f2, i, j, k, lr2, m_0, s, temp, u4;
    c = new CubieCube_0;
    d = new CubieCube_0;
    f2 = new CubieCube_2(28783, 0, 259268407, 0);
    u4 = new CubieCube_2(15138, 0, 119765538, 1792);
    lr2 = new CubieCube_2(5167, 0, 83473207, 0);
    lr2.co = [3, 3, 3, 3, 3, 3, 3, 3];
    for (i = 0; i < 16; ++i) {
      CubeSym[i] = new CubieCube_3(c);
      CornMultSym(c, u4, d);
      EdgeMult(c, u4, d);
      temp = d;
      d = c;
      c = temp;
      if (i % 4 === 3) {
        CornMultSym(temp, lr2, d);
        EdgeMult(temp, lr2, d);
        temp = d;
        d = c;
        c = temp;
      }
      if (i % 8 === 7) {
        CornMultSym(temp, f2, d);
        EdgeMult(temp, f2, d);
        temp = d;
        d = c;
        c = temp;
      }
    }
    for (j = 0; j < 16; ++j) {
      for (k = 0; k < 16; ++k) {
        CornMultSym(CubeSym[j], CubeSym[k], c);
        if (c.cp[0] === 0 && c.cp[1] === 1 && c.cp[2] === 2) {
          SymInv[j] = k;
          break;
        }
      }
    }
    for (i = 0; i < 16; ++i) {
      for (j = 0; j < 16; ++j) {
        CornMultSym(CubeSym[i], CubeSym[j], c);
        for (k = 0; k < 16; ++k) {
          if (CubeSym[k].cp[0] === c.cp[0] && CubeSym[k].cp[1] === c.cp[1] && CubeSym[k].cp[2] === c.cp[2]) {
            SymMult[i][j] = k;
            break;
          }
        }
      }
    }
    for (j = 0; j < 18; ++j) {
      for (s = 0; s < 16; ++s) {
        CornConjugate(moveCube[j], SymInv[s], c);
        CONTINUE: for (m_0 = 0; m_0 < 18; ++m_0) {
          for (i = 0; i < 8; ++i) {
            if (c.cp[i] != moveCube[m_0].cp[i] || c.co[i] != moveCube[m_0].co[i]) {
              continue CONTINUE;
            }
          }
          SymMove[s][j] = m_0;
        }
      }
    }
    for (j = 0; j < 10; ++j) {
      for (s = 0; s < 16; ++s) {
        SymMoveUD[s][j] = (std2ud)[SymMove[s][ud2std[j]]];
      }
    }
    for (j = 0; j < 8; ++j) {
      for (s = 0; s < 8; ++s) {
        Sym8Mult[s][j] = SymMult[s << 1][j << 1] >>> 1;
      }
    }
    for (j = 0; j < 18; ++j) {
      for (s = 0; s < 8; ++s) {
        Sym8Move[s][j] = SymMove[s << 1][j];
      }
    }
    for (j = 0; j < 8; ++j) {
      for (s = 0; s < 8; ++s) {
        Sym8MultInv[j][s] = Sym8Mult[j][SymInv[s << 1] >> 1];
      }
    }
  }

  function initSym2Raw() {
    var a, b, c, count, d, i, idx, j, m_0, mask, occ, s;
    c = new CubieCube_0;
    d = new CubieCube_0;
    occ = Array(1260);
    count = 0;
    for (i = 0; i < 64; occ[i++] = 0)
      ;
    for (i = 0; i < 2048; ++i) {
      if ((occ[i >>> 5] & 1 << (i & 31)) === 0) {
        $setFlip(c, i);
        for (s = 0; s < 16; s = s + 2) {
          EdgeMult(CubeSym[SymInv[s]], c, temp_0);
          EdgeMult(temp_0, CubeSym[s], d);
          idx = $getFlip(d);
          occ[idx >>> 5] |= 1 << (idx & 31);
          FlipR2S[idx] = (count << 3 | s >>> 1);
        }
        FlipS2R[count++] = i;
      }
    }
    count = 0;
    for (i = 0; i < 69; occ[i++] = 0)
      ;
    for (i = 0; i < 2187; ++i) {
      if ((occ[i >>> 5] & 1 << (i & 31)) === 0) {
        $setTwist(c, i);
        for (s = 0; s < 16; s = s + 2) {
          CornMultSym(CubeSym[SymInv[s]], c, temp_0);
          CornMultSym(temp_0, CubeSym[s], d);
          idx = $getTwist(d);
          occ[idx >>> 5] |= 1 << (idx & 31);
          TwistR2S[idx] = (count << 3 | s >>> 1);
        }
        TwistS2R[count++] = i;
      }
    }

    mask = Array(2);
    mask[0] = Array(56);
    mask[1] = Array(56);
    for (i = 0; i < 56; ++i) {
      mask[0][i] = mask[1][i] = 0;
    }
    for (i = 0; i < 40320; ++i) {
      set8Perm(c.ep, i);
      a = ~~($getURtoUL(c) / 6);
      b = ~~($getDRtoDL(c) / 6);
      mask[b >> 5][a] |= 1 << (b & 0x1f);
    }
    for (i = 0; i < 56; ++i) {
      count = 0;
      for (j = 0; j < 56; ++j) {
        ((mask[j >> 5][i] & (1 << (j & 0x1f))) != 0) && (merge[i][j] = count++);
      }
    }
    count = 0;
    for (i = 0; i < 1260; occ[i++] = 0)
      ;
    for (i = 0; i < 40320; ++i) {
      if ((occ[i >>> 5] & 1 << (i & 31)) === 0) {
        set8Perm(c.ep, i);
        for (s = 0; s < 16; ++s) {
          EdgeMult(CubeSym[SymInv[s]], c, temp_0);
          EdgeMult(temp_0, CubeSym[s], d);
          idx = get8Perm(d.ep);
          occ[idx >>> 5] |= 1 << (idx & 31);
          a = $getURtoUL(d);
          b = $getDRtoDL(d);
          m_0 = merge[~~(a / 6)][~~(b / 6)] * 4032 + a * 12 + b % 6 * 2 + get8Parity(idx);
          MtoEPerm[m_0] = (count << 4 | s);
          EPermR2S[idx] = (count << 4 | s);
        }
        EPermS2R[count++] = i;
      }
    }
  }

  function set8Perm(arr, idx) {
    var i, m_0, p, v, val;
    val = 1985229328;
    for (i = 0; i < 7; ++i) {
      p = (fact)[7 - i];
      v = ~~(idx / p);
      idx = idx - v * p;
      v <<= 2;
      arr[i] = (val >> v & 7);
      m_0 = (1 << v) - 1;
      val = (val & m_0) + (val >> 4 & ~m_0);
    }
    arr[7] = val;
  }

  function CubieCube() { }

  _ = CubieCube_3.prototype = CubieCube_2.prototype = CubieCube_0.prototype = CubieCube.prototype;
  _.temps = null;
  var CPermS2R, CubeSym, EPermR2S = null, EPermS2R, FlipR2S = null, FlipS2R, MtoEPerm, Sym8Move, Sym8Mult, Sym8MultInv, SymInv, SymMove, SymMoveUD, SymMult, TwistR2S = null, TwistS2R, e2c, merge, moveCube = null, temp_0, urf1, urf2, urfMove;


  function $Solve(cube, c) {
    var i;
    c.temps = new CubieCube_0;
    for (i = 0; i < 6; ++i) {
      cube.twist[i] = $getTwistSym(c);
      cube.tsym[i] = cube.twist[i] & 7;
      cube.twist[i] >>>= 3;
      cube.flip[i] = $getFlipSym(c);
      cube.fsym[i] = cube.flip[i] & 7;
      cube.flip[i] >>>= 3;
      cube.slice_0[i] = $getUDSlice(c);
      cube.corn0[i] = $getCPermSym(c);
      cube.csym0[i] = cube.corn0[i] & 15;
      cube.corn0[i] >>>= 4;
      cube.mid30[i] = $getMid3(c);
      cube.e10[i] = $getURtoUL(c);
      cube.e20[i] = $getDRtoDL(c);
      cube.prun[i] = Math.max(Math.max((UDSliceTwistPrun)[cube.twist[i] * 495 + UDSliceConj[cube.slice_0[i]][cube.tsym[i]]], UDSliceFlipPrun[cube.flip[i] * 495 + UDSliceConj[cube.slice_0[i]][cube.fsym[i]]]), TwistFlipPrun[cube.twist[i] * 2688 + (cube.flip[i] << 3 | (Sym8MultInv)[cube.fsym[i]][cube.tsym[i]])]);
      CornMult(urf2, c, c.temps);
      CornMult(c.temps, urf1, c);
      EdgeMult(urf2, c, c.temps);
      EdgeMult(c.temps, urf1, c);
      i === 2 && $invCubieCube(c);
    }
    cube.solution = null;
    for (cube.length1 = 0; cube.length1 < cube.sol; ++cube.length1) {
      cube.maxlength2 = Math.min(~~(cube.sol / 2) + 1, cube.sol - cube.length1);
      for (cube.urfidx = 0; cube.urfidx < 6; ++cube.urfidx) {
        cube.corn[0] = cube.corn0[cube.urfidx];
        cube.csym[0] = cube.csym0[cube.urfidx];
        cube.mid3[0] = cube.mid30[cube.urfidx];
        cube.e1[0] = cube.e10[cube.urfidx];
        cube.e2[0] = cube.e20[cube.urfidx];
        if (cube.prun[cube.urfidx] <= cube.length1 && $phase1(cube, cube.twist[cube.urfidx], cube.tsym[cube.urfidx], cube.flip[cube.urfidx], cube.fsym[cube.urfidx], cube.slice_0[cube.urfidx], cube.length1, 18)) {
          return cube.solution === null ? 'Error 8' : cube.solution;
        }
      }
    }
    return 'Error 7';
  }

  function $init2(cube) {
    var cornx, edge, esym, ex, i, lm, m_0, mid, prun, s, sb, urf;
    cube.valid2 = Math.min(cube.valid2, cube.valid1);
    for (i = cube.valid1; i < cube.length1; ++i) {
      m_0 = cube.move[i];
      cube.corn[i + 1] = (CPermMove)[cube.corn[i]][(SymMove)[cube.csym[i]][m_0]];
      cube.csym[i + 1] = SymMult[cube.corn[i + 1] & 15][cube.csym[i]];
      cube.corn[i + 1] >>>= 4;
      cube.mid3[i + 1] = Mid3Move[cube.mid3[i]][m_0];
    }
    cube.valid1 = cube.length1;
    mid = (Mid32MPerm)[cube.mid3[cube.length1] % 24];
    prun = MCPermPrun[cube.corn[cube.length1] * 24 + MPermConj[mid][cube.csym[cube.length1]]];
    if (prun >= cube.maxlength2) {
      return false;
    }
    for (i = cube.valid2; i < cube.length1; ++i) {
      cube.e1[i + 1] = Mid3Move[cube.e1[i]][cube.move[i]];
      cube.e2[i + 1] = Mid3Move[cube.e2[i]][cube.move[i]];
    }
    cube.valid2 = cube.length1;
    cornx = cube.corn[cube.length1];
    ex = (merge)[~~(cube.e1[cube.length1] / 6)][~~(cube.e2[cube.length1] / 6)] * 4032 + cube.e1[cube.length1] * 12 + cube.e2[cube.length1] % 6 * 2 + (CParity[cornx >>> 3] >>> (cornx & 7) & 1 ^ (parity4)[mid]);
    edge = MtoEPerm[ex];
    esym = edge & 15;
    edge >>>= 4;
    prun = Math.max(MEPermPrun[edge * 24 + MPermConj[mid][esym]], prun);
    if (prun >= cube.maxlength2) {
      return false;
    }
    lm = cube.length1 === 0 ? 10 : std2ud[~~(cube.move[cube.length1 - 1] / 3) * 3 + 1];
    for (i = prun; i < cube.maxlength2; ++i) {
      if ($phase2(cube, edge, esym, cube.corn[cube.length1], cube.csym[cube.length1], mid, i, cube.length1, lm)) {
        cube.sol = cube.length1 + i;
        sb = "";
        urf = cube.urfidx;
        (urf = (urf + 3) % 6);
        if (urf < 3) {
          for (s = 0; s < cube.length1; ++s) {
            sb += move2str[urfMove[urf][cube.move[s]]];
            sb += ' ';
          }
          cube.useSeparator && (sb.impl.string += '.', sb);
          for (s = cube.length1; s < cube.sol; ++s) {
            sb += move2str[urfMove[urf][cube.move[s]]];
            sb += ' ';
          }
        }
        else {
          for (s = cube.sol - 1; s >= cube.length1; --s) {
            sb += move2str[urfMove[urf][cube.move[s]]];
            sb += ' ';
          }
          cube.useSeparator && (sb += '.', sb);
          for (s = cube.length1 - 1; s >= 0; --s) {
            sb += move2str[urfMove[urf][cube.move[s]]];
            sb += ' ';
          }
        }
        cube.solution = sb;
        return true;
      }
    }
    return false;
  }

  function $phase1(cube, twist, tsym, flip, fsym, slice, maxl, lm) {
    var flipx, fsymx, m_0, slicex, tsymx, twistx;
    if (twist === 0 && flip === 0 && slice === 0 && maxl < 5) {
      return maxl === 0 && $init2(cube);
    }
    for (m_0 = 0; m_0 < 18; ++m_0) {
      if ((ckmv)[lm][m_0]) {
        m_0 += 2;
        continue;
      }
      slicex = (UDSliceMove)[slice][m_0];
      twistx = TwistMove[twist][Sym8Move[tsym][m_0]];
      tsymx = Sym8Mult[twistx & 7][tsym];
      twistx >>>= 3;
      if (UDSliceTwistPrun[twistx * 495 + UDSliceConj[slicex][tsymx]] >= maxl) {
        continue;
      }
      flipx = FlipMove[flip][Sym8Move[fsym][m_0]];
      fsymx = Sym8Mult[flipx & 7][fsym];
      flipx >>>= 3;
      if (TwistFlipPrun[twistx * 2688 + (flipx << 3 | Sym8MultInv[fsymx][tsymx])] >= maxl || UDSliceFlipPrun[flipx * 495 + UDSliceConj[slicex][fsymx]] >= maxl) {
        continue;
      }
      cube.move[cube.length1 - maxl] = m_0;
      cube.valid1 = Math.min(cube.valid1, cube.length1 - maxl);
      if ($phase1(cube, twistx, tsymx, flipx, fsymx, slicex, maxl - 1, m_0)) {
        return true;
      }
    }
    return false;
  }

  function $phase2(cube, edge, esym, corn, csym, mid, maxl, depth, lm) {
    var cornx, csymx, edgex, esymx, m_0, midx;
    if (edge === 0 && corn === 0 && mid === 0) {
      return true;
    }
    for (m_0 = 0; m_0 < 10; ++m_0) {
      if ((ckmv2)[lm][m_0]) {
        continue;
      }
      midx = (MPermMove)[mid][m_0];
      edgex = EPermMove[edge][(SymMoveUD)[esym][m_0]];
      esymx = SymMult[edgex & 15][esym];
      edgex >>>= 4;
      if (MEPermPrun[edgex * 24 + MPermConj[midx][esymx]] >= maxl) {
        continue;
      }
      cornx = CPermMove[corn][SymMove[csym][ud2std[m_0]]];
      csymx = SymMult[cornx & 15][csym];
      cornx >>>= 4;
      if (MCPermPrun[cornx * 24 + MPermConj[midx][csymx]] >= maxl) {
        continue;
      }
      cube.move[depth] = ud2std[m_0];
      if ($phase2(cube, edgex, esymx, cornx, csymx, midx, maxl - 1, depth + 1, m_0)) {
        return true;
      }
    }
    return false;
  }

  function $solution(cube, facelets) {
    var $e0, cc, i, s;
    init_0();
    for (i = 0; i < 54; ++i) {
      switch (facelets.charCodeAt(i)) {
        case 85:
          cube.f[i] = 0;
          break;
        case 82:
          cube.f[i] = 1;
          break;
        case 70:
          cube.f[i] = 2;
          break;
        case 68:
          cube.f[i] = 3;
          break;
        case 76:
          cube.f[i] = 4;
          break;
        case 66:
          cube.f[i] = 5;
          break;
        default: return 'Error 1';
      }
    }
    cc = toCubieCube(cube.f);
    cube.sol = 25;
    return $Solve(cube, cc);
  }

  function Search() {
    this.move = Array(31);
    this.corn = Array(20);
    this.csym = Array(20);
    this.mid3 = Array(20);
    this.e1 = Array(20);
    this.e2 = Array(20);
    this.twist = Array(6);
    this.tsym = Array(6);
    this.flip = Array(6);
    this.fsym = Array(6);
    this.slice_0 = Array(6);
    this.corn0 = Array(6);
    this.csym0 = Array(6);
    this.mid30 = Array(6);
    this.e10 = Array(6);
    this.e20 = Array(6);
    this.prun = Array(6);
    this.count = Array(6);
    this.f = Array(54);
  }

  _ = Search.prototype;
  _.inverse = false;
  _.length1 = 0;
  _.maxlength2 = 0;
  _.sol = 999;
  _.solution = null;
  _.urfidx = 0;
  _.useSeparator = false;
  _.valid1 = 0;
  _.valid2 = 0;

  function init_0(safeStatusCallback) {
    if (inited) {
      return;
    }
    $clinit_Util();
    safeStatusCallback("[0/9] Initializing Cubie Cube...");
    $clinit_CubieCube();
    FlipR2S = Array(2048);
    TwistR2S = Array(2187);
    EPermR2S = Array(40320);
    safeStatusCallback("[1/9] Initializing Sym2Raw...");
    initSym2Raw();
    safeStatusCallback("[2/9] Initializing CoordCube...");
    $clinit_CoordCube();
    safeStatusCallback("[3/9] Initializing Perm, Flip, and Twist Moves...");
    initCPermMove();
    initEPermMove();
    initFlipMove();
    initTwistMove();
    safeStatusCallback("[4/9] Initializing UDSlice...");
    EPermR2S = null;
    FlipR2S = null;
    TwistR2S = null;
    initUDSliceMove();
    initUDSliceConj();
    safeStatusCallback("[5/9] Initializing Mid3Move...");
    initMid3Move();
    initMid32MPerm();
    initCParity();
    safeStatusCallback("[6/9] Initializing Perms...");
    initMPermMove();
    initMPermConj();
    safeStatusCallback("[7/9] Initializing TwistFlipSlicePrun...");
    initTwistFlipSlicePrun(safeStatusCallback);
    safeStatusCallback("[8/9] Initializing MCEPermPrum...");
    initMCEPermPrun(safeStatusCallback);
    safeStatusCallback("[9/9] Done initializing 3x3x3...");
    inited = true;
  }

  var inited = false;
  function $clinit_Util() {
    $clinit_Util = nullMethod;
    cornerFacelet = [[8, 9, 20], [6, 18, 38], [0, 36, 47], [2, 45, 11], [29, 26, 15], [27, 44, 24], [33, 53, 42], [35, 17, 51]];
    edgeFacelet = [[5, 10], [7, 19], [3, 37], [1, 46], [32, 16], [28, 25], [30, 43], [34, 52], [23, 12], [21, 41], [50, 39], [48, 14]];
    cornerColor = [[0, 1, 2], [0, 2, 4], [0, 4, 5], [0, 5, 1], [3, 2, 1], [3, 4, 2], [3, 5, 4], [3, 1, 5]];
    edgeColor = [[0, 1], [0, 2], [0, 4], [0, 5], [3, 1], [3, 2], [3, 4], [3, 5], [2, 1], [2, 4], [5, 4], [5, 1]];
    Cnk = createArray(12, 12);
    fact = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600];
    move2str = ['U ', 'U2', "U'", 'R ', 'R2', "R'", 'F ', 'F2', "F'", 'D ', 'D2', "D'", 'L ', 'L2', "L'", 'B ', 'B2', "B'"];
    ud2std = [0, 1, 2, 4, 7, 9, 10, 11, 13, 16];
    std2ud = Array(18);
    ckmv = createArray(19, 18);
    ckmv2 = createArray(11, 10);
    parity4 = Array(24);
    perm3 = [[11, 10, 9], [10, 11, 9], [11, 9, 10], [9, 11, 10], [10, 9, 11], [9, 10, 11]];
    for (let i = 0; i < 10; ++i) {
      std2ud[ud2std[i]] = i;
    }
    for (let i = 0; i < 18; ++i) {
      for (let j = 0; j < 18; ++j) {
        ckmv[i][j] = ~~(i / 3) === ~~(j / 3) || ~~(i / 3) % 3 === ~~(j / 3) % 3 && i >= j;
      }
      ckmv[18][i] = false;
    }
    for (let i = 0; i < 10; ++i) {
      for (let j = 0; j < 10; ++j) {
        ckmv2[i][j] = ckmv[ud2std[i]][ud2std[j]];
      }
      ckmv2[10][i] = false;
    }
    for (let i = 0; i < 12; ++i)
      for (let j = 0; j < 12; ++j)
        Cnk[i][j] = 0;
    for (let i = 0; i < 12; ++i) {
      Cnk[i][0] = 1;
      Cnk[i][i] = 1;
      for (let j = 1; j < i; ++j) {
        Cnk[i][j] = Cnk[i - 1][j - 1] + Cnk[i - 1][j];
      }
    }
    for (let i = 0; i < 24; ++i) {
      parity4[i] = get4Parity(i);
    }
  }

  function binarySearch(arr, key) {
    let length_0 = arr.length;
    if (key <= arr[length_0 - 1]) {
      let l_0 = 0;
      let r = length_0 - 1;
      while (l_0 <= r) {
        let mid = l_0 + r >>> 1;
        let val = arr[mid];
        if (key > val) {
          l_0 = mid + 1;
        }
        else if (key < val) {
          r = mid - 1;
        }
        else {
          return mid;
        }
      }
    }
    return 65535;
  }

  function bitCount(i) {
    i = i - (i >>> 1 & 1431655765);
    i = (i & 858993459) + (i >>> 2 & 858993459);
    return i + (i >>> 8) + (i >>> 4) & 15;
  }

  function bitOdd(i) {
    i = (i ^ i >>> 1);
    i = (i ^ i >>> 2);
    i = (i ^ i >>> 4);
    i = (i ^ i >>> 8);
    return (i & 1);
  } `
  `
  function get12Parity(idx) {
    let p = 0;
    for (let i = 10; i >= 0; --i) {
      p = p + idx % (12 - i);
      idx = ~~(idx / (12 - i));
    }
    p = (p & 1);
    return p;
  }

  function get4Parity(idx) {
    let p = 0;
    for (let i = 2; i >= 0; --i) {
      p = p + idx % (4 - i);
      idx = ~~(idx / (4 - i));
    }
    p = (p & 1);
    return p;
  }

  function get8Parity(idx) {
    let p = 0;
    for (let i = 6; i >= 0; --i) {
      p = p + idx % (8 - i);
      idx = ~~(idx / (8 - i));
    }
    p = (p & 1);
    return p;
  }

  function toCubieCube(f) {
    var ccRet, col1, col2, i, j, ori;
    ccRet = new CubieCube_0;
    for (i = 0; i < 8; ++i)
      ccRet.cp[i] = 0;
    for (i = 0; i < 12; ++i)
      ccRet.ep[i] = 0;
    for (i = 0; i < 8; ++i) {
      for (ori = 0; ori < 3; ++ori)
        if (f[cornerFacelet[i][ori]] === 0 || f[cornerFacelet[i][ori]] === 3)
          break;
      col1 = f[cornerFacelet[i][(ori + 1) % 3]];
      col2 = f[cornerFacelet[i][(ori + 2) % 3]];
      for (j = 0; j < 8; ++j) {
        if (col1 === cornerColor[j][1] && col2 === cornerColor[j][2]) {
          ccRet.cp[i] = j;
          ccRet.co[i] = ori % 3;
          break;
        }
      }
    }
    for (i = 0; i < 12; ++i) {
      for (j = 0; j < 12; ++j) {
        if (f[edgeFacelet[i][0]] === edgeColor[j][0] && f[edgeFacelet[i][1]] === edgeColor[j][1]) {
          ccRet.ep[i] = j;
          ccRet.eo[i] = 0;
          break;
        }
        if (f[edgeFacelet[i][0]] === edgeColor[j][1] && f[edgeFacelet[i][1]] === edgeColor[j][0]) {
          ccRet.ep[i] = j;
          ccRet.eo[i] = 1;
          break;
        }
      }
    }
    return ccRet;
  }

  function toFaceCube(cc) {
    var c, e, f, i, j, n, ori, ts;
    f = Array(54);
    ts = [85, 82, 70, 68, 76, 66];
    for (i = 0; i < 54; ++i) {
      f[i] = ts[~~(i / 9)];
    }
    for (c = 0; c < 8; ++c) {
      j = cc.cp[c];
      ori = cc.co[c];
      for (n = 0; n < 3; ++n)
        f[cornerFacelet[c][(n + ori) % 3]] = ts[cornerColor[j][n]];
    }
    for (e = 0; e < 12; ++e) {
      j = cc.ep[e];
      ori = cc.eo[e];
      for (n = 0; n < 2; ++n)
        f[edgeFacelet[e][(n + ori) % 2]] = ts[edgeColor[j][n]];
    }
    return String.fromCharCode.apply(null, f);
  }

  var Cnk, ckmv, ckmv2, cornerColor, cornerFacelet, edgeColor, edgeFacelet, fact, move2str, parity4, perm3, std2ud, ud2std;


  /* Methods added by Lucas. */
  var randomSrc = Math;

  // If we have a better (P)RNG:
  var setRandomSrc = function (func) {
    randomSrc = func;
  }

  var initialized = false;
  var search;

  const ini = function (callback, iniRandomFunc, statusCallback) {
    if (typeof statusCallback !== "function") {
      statusCallback = function () { };
    }

    if (!initialized) {
      search = new Search();
      init_0(statusCallback);
      iniRandomFunc && setRandomSrc(iniRandomFunc);
      initialized = true;
    }
    if (callback) setTimeout(callback, 0);
  };


  // SCRAMBLERS
  const rn = (n) => Math.floor(randomSrc.random() * n);

  const shuffle = function (array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(randomSrc.random() * (i + 1));
      swap(array, i, j)
    }
    return array;
  }

  const getRandomCO = function (args) {
    if (!args.length) {
      let subsets = Object.keys(coSubsets);
      return coSubsets[subsets[rn(subsets.length)]];
    } else {
      let subsets = args.filter(a => !!coSubsets[a]);
      return coSubsets[subsets[rn(args.length)]];
    }
  }

  const permConvert = function (arr) {
    // arr contains array e.g. [0,1,2,4,3]
    let deltaArr = [];
    for (let i = 1; i < arr.length; i++) {
      let offset = 0;
      for (let j = 0; j < i; j++) {
        if (arr[j] > arr[i]) offset++;
      }
      deltaArr.push(offset);
    }
    let result = 0;
    for (let i = arr.length - 1; i > 0; i--) {
      result = i * (deltaArr[i - 1] + result);
    }
    return result;
  }

  const randomizeArr = function (arr, pos) {
    // randomize elements of arr at positions pos
    let newarr = [];
    for (let i = 0; i < pos.length; i++) {
      newarr.push(arr[pos[i]]);
    }

    for (let i = 0; i < newarr.length; i++) {
      let rnd = i + rn(newarr.length - i);
      if (rnd > i) {
        swap(newarr, rnd, i);
      }
    }

    for (let i = 0; i < pos.length; i++) {
      arr[pos[i]] = newarr[i];
    }
    return arr;
  }

  const customScramble = function (cp, ep, co, eo) {
    var cperm, eperm, cori, csum, eori, esum;
    do {
      eperm = permConvert(randomizeArr([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], ep));
      cperm = permConvert(randomizeArr([0, 1, 2, 3, 4, 5, 6, 7], cp));
    } while ((get8Parity(cperm) ^ get12Parity(eperm)) != 0);
    do {
      csum = 0;
      cori = 0;
      for (var i = 0; i < co.length; i++) {
        var j = rn(3);
        csum += j;
        cori += j * Math.pow(3, co[i]);
      }
    } while (csum % 3 != 0);
    do {
      esum = 0;
      eori = 0;
      for (var i = 0; i < eo.length; i++) {
        var j = rn(2);
        esum += j;
        eori += j * Math.pow(2, eo[i]);
      }
    } while (esum % 2 != 0);
    var posit = toFaceCube(new CubieCube_2(cperm, cori % 2187, eperm, eori % 2048));
    return $solution(search, posit);
  }

  const customScramble2 = function (cp, ep, co, eo, cpa, epa, cori, eori) {
    var cperm, eperm, cori, csum, eori, esum;
    do {
      if (epa.length <= 1) {
        eperm = permConvert(randomizeArr([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], ep));
      } else {
        eperm = permConvert(epa);
      }

      if (cpa.length <= 1) {
        cperm = permConvert(randomizeArr([0, 1, 2, 3, 4, 5, 6, 7], cp));
      } else {
        cperm = permConvert(cpa);
      }
    } while ((get8Parity(cperm) ^ get12Parity(eperm)) != 0);
    if (cori === 0) {
      do {
        csum = 0;
        cori = 0;
        for (var i = 0; i < co.length; i++) {
          var j = rn(3);
          csum += j;
          cori += j * Math.pow(3, co[i]);
        }
      } while (csum % 3 != 0);
    }
    if (eori === 0) {
      do {
        esum = 0;
        eori = 0;
        for (var i = 0; i < eo.length; i++) {
          var j = rn(2);
          esum += j;
          eori += j * Math.pow(2, eo[i]);
        }
      } while (esum % 2 != 0);
    }
    var posit = toFaceCube(new CubieCube_2(cperm, cori % 2187, eperm, eori % 2048));
    return $solution(search, posit);
  }

  const getCustomScramble = function (options) {
    return customScramble2(
      options.cp || [],
      options.ep || [],
      options.co || [],
      options.eo || [],
      options.cpa || [],
      options.epa || [],
      options.cori || 0,
      options.eori || 0
    );
  }

  return {
    initialize: function (randomSrc) { initialized = false; return ini(undefined, randomSrc); },
    setRandomSrc,
    setScrambleLength: function () { return; },
    customScramble,
    customScramble2,
    getCustomScramble,
    rn,
    shuffle,
    getRandomCO
  }
})();

export default scrambler;
