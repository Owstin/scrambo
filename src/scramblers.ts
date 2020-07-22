export interface Scramble {
  state?: string;
  scramble_string: string | '';
}

export interface Seed {
  random: () => number;
}

interface Scrambler {
  version?: string;
  initialize: (randomSource: Seed) => Function | void;
  setRandomSource: (randomSource: Seed) => void;
  getRandomScramble: (args?: string[]) => Scramble;
  setScrambleLength: (length: number) => void;
}

type ScramblerAliases = Record<string, string>;
type Scramblers = Record<string, Scrambler>;

export const aliases: ScramblerAliases = {};
export const scramblers: Scramblers = {};

const register = (scramblers: Scramblers, scramblerAliases: ScramblerAliases) =>
  (name: string, scrambler: Scrambler, aliases: string[] = []) => {
    aliases.forEach(a => { scramblerAliases[a.toLowerCase()] = name });
    scramblers[name.toLowerCase()] = scrambler;
  };

require('./scramblers/index.js')(register(scramblers, aliases));
