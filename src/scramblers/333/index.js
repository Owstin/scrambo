import standard from './standard';
import scrable2gll from './2gll';
import ble from './ble';
import cls from './cls';
import cmll from './cmll';
import cmllsune from './cmllsune';
import edges from './edges';
import fmc from './fmc';
import lccp from './lccp';
import ll from './ll';
import lsll from './lsll';
import moves from './moves';
import nls from './nls';
import pll from './pll';
import trizbll from './trizbll';
import tsle from './tsle';
import wv from './wv';
import zbll from './zbll';
import zz from './zz';
import zzll from './zzll';
import zzlsll from './zzlsll';

export default function (register) {
  standard(register);
  scrable2gll(register);
  ble(register)
  cls(register)
  cmll(register)
  cmllsune(register)
  edges(register)
  fmc(register)
  lccp(register)
  ll(register)
  lsll(register)
  moves(register)
  nls(register)
  pll(register)
  trizbll(register)
  tsle(register)
  wv(register)
  zbll(register)
  zz(register)
  zzll(register)
  zzlsll(register)
}
