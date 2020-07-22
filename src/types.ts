export interface Scramble {
  state?: string;
  scramble_string: string;
}

export interface Seed {
  random: () => number;
}

export interface Scrambler {
  version?: string;
  initialize: (randomSource: Seed) => (...args: unknown[]) => void | void;
  setRandomSource: (randomSource: Seed) => void;
  getRandomScramble: (args?: string[]) => Scramble;
  setScrambleLength: (length: number) => void;
}

export type ScramblerAliases = Record<string, string>;
export type Scramblers = Record<string, Scrambler>;

export type Register = (scramblers: Scramblers, scramblerAliases: ScramblerAliases) =>
  (name: string, scrambler: Scrambler, aliases: string[]) => void;
