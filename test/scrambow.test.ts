import { Scrambow } from '../src/scrambow';
import * as util from '../src/util';
import { scramblers, aliases } from '../src/scramblers';

describe('Scrambow', () => {
  let scrambler: Scrambow;

  beforeEach(() => {
    scrambler = new Scrambow();
  });

  describe('constructor', () => {
    beforeEach(() => {
      jest.spyOn(Scrambow.prototype, 'setType');
      jest.spyOn(Scrambow.prototype, 'setLength');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should default type to 333', () => {
      const result = new Scrambow();
      expect(result.type).toEqual('333');
    });

    it('should default length to 20', () => {
      const result = new Scrambow();
      expect(result.length).toEqual(20);
    });

    it('should throw an error if an unsupported type is given', () => {
      const message = /Invalid scrambler.+$/;
      expect(() => new Scrambow('bogus')).toThrowError(message);
    });

    describe('args', () => {
      beforeEach(() => {
        jest.spyOn(Scrambow.prototype, 'init').mockImplementation();
      });

      it('should pass first constuctor arg to setType', () => {
        const type = 'test';
        const result = new Scrambow(type);

        expect(result.setType).toHaveBeenCalledTimes(1);
        expect(result.setType).toHaveBeenCalledWith(type);
      });

      it('should pass second constructor arg to setLength', () => {
        const length = 1;
        const result = new Scrambow('test', length);

        expect(result.setLength).toHaveBeenCalledTimes(1);
        expect(result.setLength).toHaveBeenCalledWith(length);
      });
    });
  });

  describe('defaults', () => {
    it('should use Math for default seed', () => {
      expect(scrambler.seed).toEqual(Math);
    });

    it('should have an empty array for args', () => {
      expect(Array.isArray(scrambler.args)).toEqual(true);
      expect(scrambler.args).toHaveLength(0);
    });
  });

  describe('setters', () => {
    beforeEach(() => {
      jest.spyOn(Scrambow.prototype, 'init').mockImplementation();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe('setType', () => {
      const expectedType = 'my-type';
      it('should set type', () => {
        scrambler.setType(expectedType);

        expect(scrambler.type).toEqual(expectedType);
        expect(scrambler.init).toHaveBeenCalledTimes(1);
      });

      it('should get the type name from aliases', () => {
        const aliasName = 'test-alias';
        const expectedType = 'alias';
        aliases[aliasName] = expectedType;

        scrambler.setType(aliasName);

        expect(scrambler.type).toEqual(expectedType);
        delete aliases[aliasName];
      });

      it('should keep old type if no value is given', () => {
        const oldType = scrambler.type;

        const result = scrambler.setType();

        expect(result.type).toEqual(oldType);
      });

      it('should be chainable', () => {
        const result = scrambler.setType(expectedType);
        expect(scrambler).toBe(result);
      });
    });

    describe('setSeed', () => {
      beforeEach(() => {
        jest.spyOn(util, 'hashCode').mockImplementation(() => 1);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('should not have Math as the seed', () => {
        scrambler.setSeed(1);

        expect(scrambler.seed).not.toEqual(Math);
      });

      it('should call hashCode with the seed value', () => {
        const seed = 1;
        const expectedArg = seed.toString();

        scrambler.setSeed(seed);

        expect(util.hashCode).toHaveBeenCalledWith(expectedArg);
      });

      it('should keep old seed if no value is given', () => {
        const oldSeed = scrambler.seed;

        const result = scrambler.setSeed();

        expect(result.seed).toEqual(oldSeed);
      });

      it('should be chainable', () => {
        const result = scrambler.setSeed(1);

        expect(scrambler).toBe(result);
      });
    });

    describe('setLength', () => {
      const expectedLength = 100;
      it('should set length', () => {
        scrambler.setLength(expectedLength);

        expect(scrambler.length).toEqual(expectedLength);
      });

      it('should keep old length if no value is given', () => {
        const oldLength = scrambler.length;

        const result = scrambler.setLength();

        expect(result.length).toEqual(oldLength);
      });

      it('should be chainable', () => {
        const result = scrambler.setLength(expectedLength);

        expect(scrambler).toBe(result);
      });
    });

    describe('setArgs', () => {
      let expectedArgs: string[];
      beforeEach(() => {
        expectedArgs = ['my', 'cool', 'args'];
        scrambler.setArgs(...expectedArgs);
      });

      it('should set args', () => {
        expect(scrambler.args).toEqual(expectedArgs);
      });

      it('should pass the args on the getRandomScramble function', () => {
        const getRandomScrambleSpy = jest.spyOn(scramblers['333'], 'getRandomScramble').mockImplementation();
        scrambler.get();

        expect(getRandomScrambleSpy).toHaveBeenCalled();
        expect(getRandomScrambleSpy).toHaveBeenCalledWith(expectedArgs);
        jest.restoreAllMocks();
      });

      it('should keep old args if no args are given', () => {
        const oldArgs = scrambler.args;

        const result = scrambler.setArgs();

        expect(result.args).toEqual(oldArgs);
      });

      it('should be chainable', () => {
        const result = scrambler.setArgs(...expectedArgs);

        expect(scrambler).toBe(result);
      });
    });
  });

  describe('integration', () => {
    describe('seeded scrambles', () => {
      let expected: Scrambow;

      beforeEach(() => {
        expected = new Scrambow();
      });

      it('should match 2x2', () => {
        const expectedScrambes = expected.setSeed(1).setType('222').get(10);

        const generated = scrambler.setSeed(1).setType('222').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match 3x3', () => {
        const expectedScrambes = expected.setSeed(1).setType('333').get(10);

        const generated = scrambler.setSeed(1).setType('333').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match 4x4', () => {
        const expectedScrambes = expected.setSeed(1).setType('444').get(10);

        const generated = scrambler.setSeed(1).setType('444').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match 5x5', () => {
        const expectedScrambes = expected.setSeed(1).setType('555').get(10);

        const generated = scrambler.setSeed(1).setType('555').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match 6x6', () => {
        const expectedScrambes = expected.setSeed(1).setType('666').get(10);

        const generated = scrambler.setSeed(1).setType('666').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match 7x7', () => {
        const expectedScrambes = expected.setSeed(1).setType('777').get(10);

        const generated = scrambler.setSeed(1).setType('777').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match 2gll', () => {
        const expectedScrambes = expected.setSeed(1).setType('2gll').get(10);

        const generated = scrambler.setSeed(1).setType('2gll').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match ble', () => {
        const expectedScrambes = expected.setSeed(1).setType('ble').get(10);

        const generated = scrambler.setSeed(1).setType('ble').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match cls', () => {
        const expectedScrambes = expected.setSeed(1).setType('cls').get(10);

        const generated = scrambler.setSeed(1).setType('cls').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match cmll', () => {
        const expectedScrambes = expected.setSeed(1).setType('cmll').get(10);

        const generated = scrambler.setSeed(1).setType('cmll').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match cmllsune', () => {
        const expectedScrambes = expected.setSeed(1).setType('cmllsune').get(10);

        const generated = scrambler.setSeed(1).setType('cmllsune').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match edges', () => {
        const expectedScrambes = expected.setSeed(1).setType('edges').get(10);

        const generated = scrambler.setSeed(1).setType('edges').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match fmc', () => {
        const expectedScrambes = expected.setSeed(1).setType('fmc').get(10);

        const generated = scrambler.setSeed(1).setType('fmc').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match lccp', () => {
        const expectedScrambes = expected.setSeed(1).setType('lccp').get(10);

        const generated = scrambler.setSeed(1).setType('lccp').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match ll', () => {
        const expectedScrambes = expected.setSeed(1).setType('ll').get(10);

        const generated = scrambler.setSeed(1).setType('ll').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match lsll', () => {
        const expectedScrambes = expected.setSeed(1).setType('lsll').get(10);

        const generated = scrambler.setSeed(1).setType('lsll').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match lse', () => {
        const expectedScrambes = expected.setSeed(1).setType('lse').get(10);

        const generated = scrambler.setSeed(1).setType('lse').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match ru', () => {
        const expectedScrambes = expected.setSeed(1).setType('ru').get(10);

        const generated = scrambler.setSeed(1).setType('ru').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match lu', () => {
        const expectedScrambes = expected.setSeed(1).setType('lu').get(10);

        const generated = scrambler.setSeed(1).setType('lu').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match rud', () => {
        const expectedScrambes = expected.setSeed(1).setType('rud').get(10);

        const generated = scrambler.setSeed(1).setType('rud').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match rul', () => {
        const expectedScrambes = expected.setSeed(1).setType('rul').get(10);

        const generated = scrambler.setSeed(1).setType('rul').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match nls', () => {
        const expectedScrambes = expected.setSeed(1).setType('nls').get(10);

        const generated = scrambler.setSeed(1).setType('nls').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match pll', () => {
        const expectedScrambes = expected.setSeed(1).setType('pll').get(10);

        const generated = scrambler.setSeed(1).setType('pll').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match trizbll', () => {
        const expectedScrambes = expected.setSeed(1).setType('trizbll').get(10);

        const generated = scrambler.setSeed(1).setType('trizbll').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match tsle', () => {
        const expectedScrambes = expected.setSeed(1).setType('tsle').get(10);

        const generated = scrambler.setSeed(1).setType('tsle').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match wv', () => {
        const expectedScrambes = expected.setSeed(1).setType('wv').get(10);

        const generated = scrambler.setSeed(1).setType('wv').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match zbll', () => {
        const expectedScrambes = expected.setSeed(1).setType('zbll').get(10);

        const generated = scrambler.setSeed(1).setType('zbll').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match zz', () => {
        const expectedScrambes = expected.setSeed(1).setType('zz').get(10);

        const generated = scrambler.setSeed(1).setType('zz').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match zzll', () => {
        const expectedScrambes = expected.setSeed(1).setType('zzll').get(10);

        const generated = scrambler.setSeed(1).setType('zzll').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match zzlsll', () => {
        const expectedScrambes = expected.setSeed(1).setType('2gll').get(10);

        const generated = scrambler.setSeed(1).setType('2gll').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match clock', () => {
        const expectedScrambes = expected.setSeed(1).setType('clock').get(10);

        const generated = scrambler.setSeed(1).setType('clock').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match minx', () => {
        const expectedScrambes = expected.setSeed(1).setType('minx').get(10);

        const generated = scrambler.setSeed(1).setType('minx').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match pyram', () => {
        const expectedScrambes = expected.setSeed(1).setType('pyram').get(10);

        const generated = scrambler.setSeed(1).setType('pyram').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match skewb', () => {
        const expectedScrambes = expected.setSeed(1).setType('skewb').get(10);

        const generated = scrambler.setSeed(1).setType('skewb').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match sq1', () => {
        const expectedScrambes = expected.setSeed(1).setType('sq1').get(10);

        const generated = scrambler.setSeed(1).setType('sq1').get(10);

        expect(generated).toEqual(expectedScrambes);
      });

      it('should match fto', () => {
        const expectedScrambes = expected.setSeed(1).setType('fto').get(10);

        const generated = scrambler.setSeed(1).setType('fto').get(10);

        expect(generated).toEqual(expectedScrambes);
      });
    });

    describe('manual length', () => {
      const expectedLength = 50;

      const getScramble = (type: string, length: number) => scrambler
        .setType(type)
        .setLength(length)
        .get()
        .map(s => s.scramble_string)
        .join();

      const getScrambleLength = (scrambleString: string) => scrambleString.split(/\s+/).length;

      describe('4x4', () => {
        it('should generate a scramble with the expected length', () => {
          const result = getScramble('444', expectedLength);
          expect(getScrambleLength(result)).toEqual(expectedLength);
        });
      });

      describe('5x5', () => {
        it('should generate a scramble with the expected length', () => {
          const result = getScramble('555', expectedLength);
          expect(getScrambleLength(result)).toEqual(expectedLength);
        });
      });

      describe('6x6', () => {
        it('should generate a scramble with the expected length', () => {
          const result = getScramble('666', expectedLength);
          expect(getScrambleLength(result)).toEqual(expectedLength);
        });
      });

      describe('7x7', () => {
        it('should generate a scramble with the expected length', () => {
          const result = getScramble('777', expectedLength);
          expect(getScrambleLength(result)).toEqual(expectedLength);
        });
      });

      describe('skewb', () => {
        it('should generate a scramble with the expected length', () => {
          const result = getScramble('skewb', expectedLength);
          expect(getScrambleLength(result)).toEqual(expectedLength);
        });
      });

      describe('minx', () => {
        it('should generate a scramble with the expected length', () => {
          const result = getScramble('minx', expectedLength);
          const rows = result.split('\n');
          const scrambleString = rows.join(' ');

          expect(getScrambleLength(scrambleString)).toEqual(expectedLength * rows.length + rows.length);
        });
      });

      describe('lse', () => {
        it('should generate a scramble with the expected length', () => {
          const result = getScramble('lse', expectedLength);
          expect(getScrambleLength(result)).toEqual(expectedLength);
        });
      });

      describe('ru', () => {
        it('should generate a scramble with the expected length', () => {
          const result = getScramble('ru', expectedLength);
          expect(getScrambleLength(result)).toEqual(expectedLength);
        });
      });

      describe('lu', () => {
        it('should generate a scramble with the expected length', () => {
          const result = getScramble('lu', expectedLength);
          expect(getScrambleLength(result)).toEqual(expectedLength);
        });
      });

      describe('rud', () => {
        it('should generate a scramble with the expected length', () => {
          const result = getScramble('rud', expectedLength);
          expect(getScrambleLength(result)).toEqual(expectedLength);
        });
      });

      describe('rul', () => {
        it('should generate a scramble with the expected length', () => {
          const result = getScramble('rul', expectedLength);
          expect(getScrambleLength(result)).toEqual(expectedLength);
        });
      });

      describe('fto', () => {
        it('should generate a scramble with the expected length', () => {
          const result = getScramble('fto', expectedLength);
          expect(getScrambleLength(result)).toEqual(expectedLength);
        });
      });
    });
  });
});
