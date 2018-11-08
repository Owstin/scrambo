export interface Scrambler {
  version?: string;
  initialize: (randomSource: Seed) => Function | void;
  setRandomSource: (randomSource: Seed) => void;
  getRandomScramble: () => Scramble;
  setScrambleLength: (length: number) => void;
}

export interface Scramble {
  state: any;
  scramble_string: string | '';
}

export interface Seed {
  random: () => number;
}

export interface Scramblers {
  [key: string]: Scrambler
}
