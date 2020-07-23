const CO = {
  BLD: 0,
  FLD: 1,
  FRD: 2,
  BRU: 3,
  BLU: 4,
  FLU: 5,
  FRU: 6,
  BRD: 7
};

const CP = {
  BDR: 0,
  BLD: 1,
  FLD: 2,
  DFR: 3,
  BRU: 4,
  BLU: 5,
  FLU: 6,
  FRU: 7
};

const EP = {
  BR: 0,
  BL: 1,
  FL: 2,
  FR: 3,
  DB: 4,
  DL: 5,
  DF: 6,
  DR: 7,
  UB: 8,
  UL: 9,
  UF: 10,
  UR: 11
};

const EO = {
  UR: 0,
  UF: 1,
  UL: 2,
  UB: 3,
  DL: 4,
  DF: 5,
  DR: 6,
  DB: 7,
  FR: 8,
  FL: 9,
  BL: 10,
  BR: 11
};

/*     0   1   2   3   4   5   6   7
 * co: BLD FLD FRD BRU BLU FLU FRU BRD
 * cp: BDR BLD FLD DFR BRU BLU FLU FRU
 *
 *     0  1  2  3  4  5  6  7  8  9  10 11
 * ep: BR BL FL FR DB DL DF DR UB UL UF UR
 * eo: UR UF UL UB DL DF DR DB FR FL BL BR
 *
 * cori:
 * */

export {
  CP,
  CO,
  EP,
  EO
}
