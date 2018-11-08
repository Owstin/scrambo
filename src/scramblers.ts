import { Scramblers } from './models/Scrambler';
import { MinxScrambler } from './scramblers/minx';
import { ClockScrambler } from './scramblers/clock';
import { NNNScrambler } from './scramblers/nnn';
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
scramblers.pyram = require('./scramblers/pyram.js');
scramblers.sq1 = require('./scramblers/sq1.js');
scramblers.skewb = require('./scramblers/skewb.js');
