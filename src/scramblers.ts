import { Scramblers } from './models/Scrambler';
import { MinxScrambler } from './scramblers/minx';
import { ClockScrambler } from './scramblers/clock';
import { NNNScrambler } from './scramblers/nnn';
import { PyramScrambler } from './scramblers/pyram';
import { TwoScrambler } from './scramblers/222';

export let scramblers: Scramblers = {};
scramblers['444'] = new NNNScrambler(4, 40);
scramblers['555'] = new NNNScrambler(5, 60);
scramblers['666'] = new NNNScrambler(6, 70);
scramblers['777'] = new NNNScrambler(7, 100);
scramblers['222'] = new TwoScrambler();
scramblers['333'] = require('./scramblers/333.js');
scramblers.clock = new ClockScrambler();
scramblers.minx = new MinxScrambler();
scramblers.pyram = new PyramScrambler();
scramblers.skewb = require('./scramblers/skewb.js');
