# Scrambow - Puzzle Scramble Generator
![scrambo](http://rawgithub.com/nickcolley/scrambo/master/scrambo.svg)

## Usage
```javascript
// Generate a new 4x4 scramble with the seed of 1
var seeded_scramble = new Scrambow().setType('444').setSeed(1).get();
console.log(seeded_scramble);

// Generate 5 scrambles (defaults to 3x3)
var multiple_scrambles = new Scrambow().get(5);
console.log(multiple_scrambles);
```

## Cli
```bash
# install
npm install -g scrambow
# or
yarn global add scrambow

# usage
scrambow -t 333 -n 5

# only generate 2gll scrambles with H, Pi or T corner orientations
scrambow -t 2gll -n 100 H Pi T

# only generate zz scrambles with 0, 6 or 12 flipped edges
scrambow -t zz -n 12 0 6 12
```
### Command line options
```
-V, --version        output the version number
-n, --number [num]   set amount of scrambles to generate
-t, --type [string]  set the scramble type (default: "333")
-s, --seed [num]     set seed
-l, --length [num]   set scramble length
-h, --help           output usage information
```

## Node.js
```bash
npm install scrambow
```
```javascript
var Scrambow = require('scrambow').Scrambow;

var threebythree = new Scrambow(); // Defaults to 3x3
console.log(threebythree.get(5)); // Returns 5 scrambles
```

## API
```javascript
.get(num); // Returns a number of scrambles, defaults to 1.
.setType(str); // Sets the scramble type, defaults to 333.
.setSeed(num); // Repeatable scrambles.
.setLength(num); // Set scramble length, currently only for NNN, minx scrambles.
.setArgs(...args); // Set scramble args for 2gll, cls, trizbll, tsle, zbll and zz
```

## Scramblers
Current list of supported scramblers
- 2x2
- 3x3

  subsets
    - 2gll

      args: U, T, L, S, As, Pi, H
    - ble
    - cls

      args: -, +, O, i, im
    - cmll

      args: U, T, L, S, As, Pi, H
    - edges
    - fmc
    - lccp
    - ll
    - lsll
    - lu
    - nls
    - pll
    - random moves (non random state)
      - lse
      - lu
      - ru
      - rud
      - rul
    - trizbll

      args: U, T, L, S, As, Pi, H
    - tsle

      args: twoGen
    - wv
    - zz

      args: # of flipped edges
    - zzll
    - zzlsll
- 4x4
- 5x5
- 6x6
- 7x7
- clock
- megaminx
- pyraminx
- skewb
- square 1


## Credits
This is a fork of [scrambo](https://github.com/nickcolley/scrambo)
