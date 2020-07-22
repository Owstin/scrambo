import { ScramblerAliases, Scramblers, Register } from './types.js';
import scramblerGenerators from './scramblers/index.js';

export const aliases: ScramblerAliases = {};
export const scramblers: Scramblers = {};

const register: Register = (scramblers, scramblerAliases) =>
  (name, scrambler, aliases = []): void => {
    aliases.forEach(a => { scramblerAliases[a.toLowerCase()] = name; });
    scramblers[name.toLowerCase()] = scrambler;
  };

scramblerGenerators(register(scramblers, aliases));
