const rn = (n) => Math.floor(randomSource.random() * n);
const rndEl = (n) => n[rn(n.length)];

const cubesuff=["","2","'"];
const minxsuff=["","2","'","2'"];
const args = {
  "fto": {
    moves: [[["U","D"],["F","B"],["L","BR"],["R","BL"]],["","'"]], // FTO/Face-Turning Octa,
    length: 25,
  },
};

// var args2 = {
//   'sia113': '#{[["U","u"],["R","r"]],%c,%l} z2 #{[["U","u"],["R","r"]],%c,%l}',
//   'sia123': '#{[["U"],["R","r"]],%c,%l} z2 #{[["U"],["R","r"]],%c,%l}',
//   'sia222': '#{[["U"],["R"],["F"]],%c,%l} z2 y #{[["U"],["R"],["F"]],%c,%l}',
//   '335': '#{[[["U","U\'","U2"],["D","D\'","D2"]],["R2","L2"],["F2","B2"]],0,%l} / ${333}',
//   '337': '#{[[["U","U\'","U2","u","u\'","u2","U u","U u\'","U u2","U\' u","U\' u\'","U\' u2","U2 u","U2 u\'","U2 u2"],["D","D\'","D2","d","d\'","d2","D d","D d\'","D d2","D\' d","D\' d\'","D\' d2","D2 d","D2 d\'","D2 d2"]],["R2","L2"],["F2","B2"]],0,%l} / ${333}',
//   'r234': '2) ${222so}\\n3) ${333}\\n4) ${[444,40]}',
//   'r2345': '${r234}\\n5) ${["555",60]}',
//   'r23456': '${r2345}\\n6) ${["666p",80]}',
//   'r234567': '${r23456}\\n7) ${["777p",100]}',
//   'r234w': '2) ${222so}\\n3) ${333}\\n4) ${["444m",40]}',
//   'r2345w': '${r234w}\\n5) ${["555wca",60]}',
//   'r23456w': '${r2345w}\\n6) ${["666wca",80]}',
//   'r234567w': '${r23456w}\\n7) ${["777wca",100]}',
//   '333ni': '${333}#{[[""]],["","Rw ","Rw2 ","Rw\' ","Fw ","Fw\' "],1}#{[[""]],["","Uw","Uw2","Uw\'"],1}',
//   '444bld': '${444wca}#{[[""]],[""," x"," x2"," x\'"," z"," z\'"],1}#{[[""]],[""," y"," y2"," y\'"],1}',
//   '555bld': '${["555wca",%l]}#{[[""]],[""," 3Rw"," 3Rw2"," 3Rw\'"," 3Fw"," 3Fw\'"],1}#{[[""]],[""," 3Uw"," 3Uw2"," 3Uw\'"],1}'
// };

// var edges = {
//   '4edge': ["r b2",["b2 r'","b2 U2 r U2 r U2 r U2 r"],["u"]],
//   '5edge': ["r R b B",["B' b' R' r'","B' b' R' U2 r U2 r U2 r U2 r"],["u","d"]], 
//   '6edge': ["3r r 3b b",["3b' b' 3r' r'","3b' b' 3r' U2 r U2 r U2 r U2 r","3b' b' r' U2 3r U2 3r U2 3r U2 3r","3b' b' r2 U2 3r U2 3r U2 3r U2 3r U2 r"],["u","3u","d"]],
//   '7edge': ["3r r 3b b",["3b' b' 3r' r'","3b' b' 3r' U2 r U2 r U2 r U2 r","3b' b' r' U2 3r U2 3r U2 3r U2 3r","3b' b' r2 U2 3r U2 3r U2 3r U2 3r U2 r"],["u","3u","3d","d"]]
// };

function mega(turns = [['']], suffixes = [''], length = 0) {
  let donemoves = 0;
  let lastaxis = -1;
  let s = [];
  let first, second;

  for (let i = 0; i < length; i++) {
    do {
      first = rn(turns.length);
      second = rn(turns[first].length);
      if (first != lastaxis) {
        donemoves = 0;
        lastaxis = first;
      }
    } while (((donemoves >> second) & 1) != 0);

    donemoves |= 1 << second;

    if (turns[first][second].constructor == Array) {
      s.push(rndEl(turns[first][second]) + rndEl(suffixes));
    } else {
      s.push(turns[first][second] + rndEl(suffixes));
    }
  }

  return s.join(' ');
}

// function edge(start, end, moves, len) {
//   var u=0,d=0,movemis=[];
//   var triggers=[["R","R'"],["R'","R"],["L","L'"],["L'","L"],["F'","F"],["F","F'"],["B","B'"],["B'","B"]];
//   var ud=["U","D"];
//   var scramble = start;
//   // initialize move misalignments
//   for (var i=0; i<moves.length; i++) {
//     movemis[i] = 0;
//   }

//   for (var i=0; i<len; i++) {
//     // apply random moves
//     var done = false;
//     while (!done) {
//       var v = "";
//       for (var j=0; j<moves.length; j++) {
//         var x = rn(4);
//         movemis[j] += x;
//         if (x!=0) {
//           done = true;
//           v += " " + moves[j] + cubesuff[x-1];
//         }
//       }
//     }
//     // apply random trigger, update U/D
//     var trigger = rn(8);
//     var layer = rn(2);
//     var turn = rn(3);
//     scramble += v + " " + triggers[trigger][0] + " " + ud[layer] + cubesuff[turn] + " " + triggers[trigger][1];
//     if (layer==0) {u += turn+1;}
//     if (layer==1) {d += turn+1;}
//   }

//   // fix everything
//   for (var i=0; i<moves.length; i++) {
//     var x = 4-(movemis[i]%4);
//     if (x<4) {
//       scramble += " " + moves[i] + cubesuff[x-1];
//     }
//   }
//   u = 4-(u%4); d = 4-(d%4);
//   if (u<4) {
//     scramble += " U" + cubesuff[u-1];
//   }
//   if (d<4) {
//     scramble += " D" + cubesuff[d-1];
//   }
//   scramble += " " + rndEl(end);
//   return scramble;
// }

function megascramble(type, length) {
  var value = args[type];

  switch (value.moves.length) {
    case 1: return mega(value.moves[0], [""], length || value.length);
    case 2: return mega(value.moves[0], value.moves[1], length || value.length);
    case 3: return mega(value.moves[0], value.moves[1], value.moves[2]);
  }
}

// function formatScramble(type, length) {
//   var value = args2[type].replace(/%l/g, length).replace(/%c/g, '["","2","\'"]');
//   return value;
// }

// function edgescramble(type, length) {
//   var value = edges[type];
//   return edge(value[0], value[1], value[2], length);
// }

const registerMega = function (register) {
  const scrambler = function (scrambleFunc, type, length) {
    let len = length;

    const setRandomSrc = (rndSource) => {
      randomSource = rndSource;
    }

    return {
      initialize: setRandomSrc,
      setRandomSrc: setRandomSrc,
      getRandomScramble: () => ({
        scramble_string: scrambleFunc(type, len || args.length)
      }),
      setScrambleLength: (l) => {
        len = l;
      }
    }
  }

  for (var i in args) {
    register(i, scrambler(megascramble, i, args[i].length));
  }

  // for (var i in args2) {
  //   register(i, scrambler(formatScramble, i, args2[i].length));
  // }

  // for (var i in edges) {
  //   register(i, scrambler(edgescramble, i, edges[i].length));
  // }
}

module.exports = registerMega;
