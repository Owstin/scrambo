import { ScramblerAliases, Scramblers, Register } from './types.js';
import scrambleGenerators from './scramblers/index.js';

export const aliases: ScramblerAliases = {};
export const scramblers: Scramblers = {};

const register: Register = (scramblers, scramblerAliases) =>
  (name, scrambler, aliases = []) => {
    aliases.forEach(a => { scramblerAliases[a.toLowerCase()] = name; });
    scramblers[name.toLowerCase()] = scrambler;
  };

scrambleGenerators(register(scramblers, aliases));
