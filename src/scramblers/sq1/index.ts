import { Scrambler, Seed, Scramble } from '../../models/Scrambler';
import { Sq1FullCube } from './fullcube';
import { Sq1Search } from './search';
import { Sq1Shape } from './shape';
import { Sq1Square } from './square';

// doesn't produce the same output as the original js file
export class Sq1Scrambler implements Scrambler {
  private sq1Shape = new Sq1Shape();
  private sq1Square = new Sq1Square();
  private fullCube = new Sq1FullCube(this.sq1Shape);
  private search = new Sq1Search(this.fullCube, this.sq1Square);

  initialize(src: Seed) {
    this.setRandomSource(src);
  }

  setRandomSource(src: Seed) {
    this.fullCube.randomSource = src;
  }

  setScrambleLength() {
    return;
  }

  getRandomScramble(): Scramble {
    const randomState = this.fullCube.FullCube_randomCube();
    const scrambleString = this.search.Search_solution(this.search, randomState);

    return {
      state: randomState,
      scramble_string: scrambleString
    }
  }
}
