import scramble222 from './222';
import scramble333 from './333';
import scrambleNNN from './nnn';
import clock from './clock';
import mega from './mega';
import minx from './minx';
import pyra from './pyram';
import skewb from './skewb';
import sq1 from './sq1';

export default function (register) {
  scramble222(register);
  scramble333(register);
  scrambleNNN(register);
  clock(register);
  mega(register);
  minx(register);
  pyra(register);
  skewb(register);
  sq1(register);
}
