!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Scrambo=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/*

scramble_NNN.js

NxNxN Scramble Generator in Javascript.

Code taken from the official WCA scrambler.
Ported by Lucas Garron, November 24, 2011.

 */

"use strict";
if (typeof scramblers === "undefined") {
  var scramblers = {};
}

// We use an anonymous wrapper (and call it immediately) in order to avoid leaving the generator hanging around in the top-level scope.
(function(){

  var generate_NNN_scrambler = function(size, seqlen, mult) {
      return (function () {
      // Default settings
      //var size=3;
      //var seqlen=30;
      var numcub=1;
      //var mult=false;
      var cubeorient=false;
      var colorString = "yobwrg";  //In dlburf order. May use any colours in colorList below
       
      // list of available colours
      var colorList=new Array(
        'y', "yellow.jpg", "yellow",
        'b', "blue.jpg",   "blue",
        'r', "red.jpg",    "red",
        'w', "white.jpg",  "white",
        'g', "green.jpg",  "green",
        'o', "orange.jpg", "orange",
        'p', "purple.jpg", "purple",
        '0', "grey.jpg",   "grey"      // used for unrecognised letters, or when zero used.
      );
       
      var colors=new Array(); //stores colours used
      var seq=new Array();  // move sequences
      var posit = new Array();  // facelet array
      var flat2posit; //lookup table for drawing cube
      var colorPerm = new Array(); //dlburf face colour permutation for each cube orientation
      colorPerm[ 0] = new Array(0,1,2,3,4,5);
      colorPerm[ 1] = new Array(0,2,4,3,5,1);
      colorPerm[ 2] = new Array(0,4,5,3,1,2);
      colorPerm[ 3] = new Array(0,5,1,3,2,4);
      colorPerm[ 4] = new Array(1,0,5,4,3,2);
      colorPerm[ 5] = new Array(1,2,0,4,5,3);
      colorPerm[ 6] = new Array(1,3,2,4,0,5);
      colorPerm[ 7] = new Array(1,5,3,4,2,0);
      colorPerm[ 8] = new Array(2,0,1,5,3,4);
      colorPerm[ 9] = new Array(2,1,3,5,4,0);
      colorPerm[10] = new Array(2,3,4,5,0,1);
      colorPerm[11] = new Array(2,4,0,5,1,3);
      colorPerm[12] = new Array(3,1,5,0,4,2);
      colorPerm[13] = new Array(3,2,1,0,5,4);
      colorPerm[14] = new Array(3,4,2,0,1,5);
      colorPerm[15] = new Array(3,5,4,0,2,1);
      colorPerm[16] = new Array(4,0,2,1,3,5);
      colorPerm[17] = new Array(4,2,3,1,5,0);
      colorPerm[18] = new Array(4,3,5,1,0,2);
      colorPerm[19] = new Array(4,5,0,1,2,3);
      colorPerm[20] = new Array(5,0,4,2,3,1);
      colorPerm[21] = new Array(5,1,0,2,4,3);
      colorPerm[22] = new Array(5,3,1,2,0,4);
      colorPerm[23] = new Array(5,4,3,2,1,0);
       
      // get all the form settings from the url parameters
      function parse() {

        /*
        var s="";
        var urlquery=location.href.split("?")
        if(urlquery.length>1){
          var urlterms=urlquery[1].split("&")
          for( var i=0; i<urlterms.length; i++){
            var urllr=urlterms[i].split("=");
            if(urllr[0]==="size") {
              if(urllr[1]-0 >= 2 ) size=urllr[1]-0;
            } else if(urllr[0]==="len") {
              if(urllr[1]-0 >= 1 ) seqlen=urllr[1]-0;
            } else if(urllr[0]==="num"){
              if(urllr[1]-0 >= 1 ) numcub=urllr[1]-0;
            } else if(urllr[0]==="multi") {
              mult=(urllr[1]==="on");
            } else if(urllr[0]==="cubori") {
              cubeorient=(urllr[1]==="on");
            } else if(urllr[0]==="col") {
              if(urllr[1].length===6) colorString = urllr[1];
            }
          }
        }*/

        // build lookup table
        var i, j;
        flat2posit=new Array(12*size*size);
        for(i=0; i<flat2posit.length; i++) flat2posit[i]=-1;
        for(i=0; i<size; i++){
          for(j=0; j<size; j++){
            flat2posit[4*size*(3*size-i-1)+  size+j  ]=        i *size+j; //D
            flat2posit[4*size*(  size+i  )+  size-j-1]=(  size+i)*size+j; //L
            flat2posit[4*size*(  size+i  )+4*size-j-1]=(2*size+i)*size+j; //B
            flat2posit[4*size*(       i  )+  size+j  ]=(3*size+i)*size+j; //U
            flat2posit[4*size*(  size+i  )+2*size+j  ]=(4*size+i)*size+j; //R
            flat2posit[4*size*(  size+i  )+  size+j  ]=(5*size+i)*size+j; //F
          }
        }
       
        /*
               19                32
           16           48           35
               31   60      51   44
           28     80    63    67     47
                      83  64
                  92          79
                      95  76
         
                         0
                     12     3
                        15
        */
       
        // expand colour string into 6 actual html color names
        for(var k=0; k<6; k++){
          colors[k]=colorList.length-3; // gray
          for( var i=0; i<colorList.length; i+=3 ){
            if( colorString.charAt(k)===colorList[i] ){
              colors[k]=i;
              break;
            }
          }
        }
      }
       
      // append set of moves along an axis to current sequence in order
      function appendmoves( sq, axsl, tl, la ){
        for( var sl=0; sl<tl; sl++){  // for each move type
          if( axsl[sl] ){       // if it occurs
            var q=axsl[sl]-1;
       
            // get semi-axis of this move
            var sa = la;
            var m = sl;
            if(sl+sl+1>=tl){ // if on rear half of this axis
              sa+=3; // get semi-axis (i.e. face of the move)
              m=tl-1-m; // slice number counting from that face
              q=2-q; // opposite direction when looking at that face
            }
            // store move
            sq[sq.length]=(m*6+sa)*4+q;
          }
        }
      }
       
      // generate sequence of scambles
      function scramble(){
        //tl=number of allowed moves (twistable layers) on axis -- middle layer ignored
        var tl=size;
        if(mult || (size&1)!=0 ) tl--;
        //set up bookkeeping
        var axsl=new Array(tl);    // movement of each slice/movetype on this axis
        var axam=new Array(0,0,0); // number of slices moved each amount
        var la; // last axis moved
       
        // for each cube scramble
        for( var n=0; n<numcub; n++){
          // initialise this scramble
          la=-1;
          seq[n]=new Array(); // moves generated so far
          // reset slice/direction counters
          for( var i=0; i<tl; i++) axsl[i]=0;
          axam[0]=axam[1]=axam[2]=0;
          var moved = 0;
       
          // while generated sequence not long enough
          while( seq[n].length + moved <seqlen ){
       
            var ax, sl, q;
            do{
              do{
                // choose a random axis
                ax=Math.floor(randomSource.random()*3);
                // choose a random move type on that axis
                sl=Math.floor(randomSource.random()*tl);
                // choose random amount
                q=Math.floor(randomSource.random()*3);
              }while( ax===la && axsl[sl]!=0 );    // loop until have found an unused movetype
            }while( ax===la          // loop while move is reducible: reductions only if on same axis as previous moves
                && !mult        // multislice moves have no reductions so always ok
                && tl===size       // only even-sized cubes have reductions (odds have middle layer as reference)
                && (
                  2*axam[0]===tl ||  // reduction if already have half the slices move in same direction
                  2*axam[1]===tl ||
                  2*axam[2]===tl ||
                  (
                    2*(axam[q]+1)===tl // reduction if move makes exactly half the slices moved in same direction and
                    &&
                    axam[0]+axam[1]+axam[2]-axam[q] > 0 // some other slice also moved
                  )
                  )
            );
       
            // if now on different axis, dump cached moves from old axis
            if( ax!=la ) {
              appendmoves( seq[n], axsl, tl, la );
              // reset slice/direction counters
              for( var i=0; i<tl; i++) axsl[i]=0;
              axam[0]=axam[1]=axam[2]=0;
              moved = 0;
              // remember new axis
              la=ax;
            }
       
            // adjust counters for this move
            axam[q]++;// adjust direction count
            moved++;
            axsl[sl]=q+1;// mark the slice has moved amount
       
          }
          // dump the last few moves
          appendmoves( seq[n], axsl, tl, la );
       
          // do a random cube orientation if necessary
          seq[n][seq[n].length]= cubeorient ? Math.floor(randomSource.random()*24) : 0;
        }
       
      }

      var cubeSize = size;

      var border = 2;
      var width = 40/cubeSize;
      var gap = 4;

      function colorGet(col){
        if (col==="r") return ("#FF0000");
        if (col==="o") return ("#FF8000");
        if (col==="b") return ("#0000FF");
        if (col==="g") return ("#00FF00");
        if (col==="y") return ("#FFFF00");
        if (col==="w") return ("#FFFFFF");
        if (col==="x") return ("#000000");
      }

      var scalePoint = function(w, h, ptIn) {
        
        var defaultWidth = border*2+width*4*cubeSize+gap*3;
        var defaultHeight = border*2+width*3*cubeSize+gap*2;

        var scale = Math.min(w/defaultWidth, h/defaultHeight);

        var x = ptIn[0]*scale + (w - (defaultWidth * scale))/2;
        var y = ptIn[1]*scale + (h - (defaultHeight * scale))/2;

        return [x, y];
      }

      function drawSquare(r, canvasWidth, canvasHeight, cx, cy, w, fillColor) {

        var arrx = [cx - w, cx - w, cx + w, cx + w];
        var arry = [cy - w, cy + w, cy + w, cy - w];

        var pathString = "";
        for (var i = 0; i < arrx.length; i++) {
          var scaledPoint = scalePoint(canvasWidth, canvasHeight, [arrx[i], arry[i]]);
          pathString += ((i===0) ? "M" : "L") + scaledPoint[0] + "," + scaledPoint[1];
        }
        pathString += "z";
          
        r.path(pathString).attr({fill: colorGet(fillColor), stroke: "#000"})
      }

      var drawScramble = function(parentElement, state, w, h) {

        initializeDrawing();

        var colorString = "wrgoby"; // UFRLBD

        var r = Raphael(parentElement, w, h);

        var s="",i,f,d=0,q;
        var ori = 0;
        d=0;
        s="<table border=0 cellpadding=0 cellspacing=0>";
        for(i=0;i<3*size;i++){
          s+="<tr>";
          for(f=0;f<4*size;f++){
            if(flat2posit[d]<0){
              s+="<td><\/td>";
            }else{
              var c = colorPerm[ori][state[flat2posit[d]]];
              var col = colorList[colors[c]+0];
              drawSquare(r, w, h, border + width /2 + f*width + gap*Math.floor(f/cubeSize), border + width /2 + i*width + gap*Math.floor(i/cubeSize), width/2, col);
              //s+="<td style='background-color:"+colorList[colors[c]+2]+"'><img src='scrbg/"+colorList[colors[c]+1]+"' width=10 border=1 height=10><\/td>";
            }
            d++;
          }
          s+="<\/tr>";
        }
        s+="<\/table>";
        return(s);
      }
       
      function scramblestring(n){
        var s="",j;
        for(var i=0; i<seq[n].length-1; i++){
          if( i!=0 ) s+=" ";
          var k=seq[n][i]>>2;
       
          j=k%6; k=(k-j)/6;
          if( k && size<=5 && !mult ) {
            s+="dlburf".charAt(j);  // use lower case only for inner slices on 4x4x4 or 5x5x5
          }else{
            if(size<=5 && mult ){
              s+="DLBURF".charAt(j);
              if(k) s+="w"; // use w only for double layers on 4x4x4 and 5x5x5
            }
            else{
              if(k) s+=(k+1);
              s+="DLBURF".charAt(j);
            }
          }
       
          j=seq[n][i]&3;
          if(j!=0) s+=" 2'".charAt(j);
        }
       
        // add cube orientation
        if( cubeorient ){
          var ori = seq[n][seq[n].length-1];
          s="Top:"+colorList[ 2+colors[colorPerm[ori][3]] ]
            +"&nbsp;&nbsp;&nbsp;Front:"+colorList[2+ colors[colorPerm[ori][5]] ]+"<br>"+s;
        }
        return s;
      }
       
      function imagestring(nr){
        var s="",i,f,d=0,q;
       
        // initialise colours
        for( i=0; i<6; i++)
          for( f=0; f<size*size; f++)
            posit[d++]=i;
       
        // do move sequence
        for(i=0; i<seq[nr].length-1; i++){
          q=seq[nr][i]&3;
          f=seq[nr][i]>>2;
          d=0;
          while(f>5) { f-=6; d++; }
          do{
            doslice(f,d,q+1);
            d--;
          }while( mult && d>=0 );
        }
       
        // build string containing cube
        var ori = seq[nr][seq[nr].length-1];
        d=0;
        var imageheight = 160; // height of cube images in pixels (160px is a good height for fitting 5 images on a sheet of paper)
        var stickerheight = Math.floor(imageheight/(size*3));
        if(stickerheight < 5) { stickerheight = 5; } // minimum sticker size of 5px, takes effect when cube size reaches 11
        s="<div style='width:"+(stickerheight*size*4)+"px; height:"+(stickerheight*size*3)+"px;'>";
        for(i=0;i<3*size;i++){
          s+="<div style='float: left; display: block; height: "+stickerheight+"px; width: "+(stickerheight*size*4)+"px; line-height: 0px;'>";
          for(f=0;f<4*size;f++){
            if(flat2posit[d]<0){
              s+="<div style='overflow: hidden; display: block; float: left; height: "+stickerheight+"px; width: "+stickerheight+"px;'></div>";
            }else{
              var c = colorPerm[ori][posit[flat2posit[d]]];
              s+="<div style='overflow: hidden; display: block; float: left; border: 1px solid #000; height: "+(stickerheight*1-2)+"px; width: "+(stickerheight*1-2)+"px;'><img src='scrbg/"+colorList[colors[c]+1]+"' /></div>";
            }
            d++;
          }
          s+="</div>";
        }
        s+="</div>";
        return(s);
      }
       
      function doslice(f,d,q){
        //do move of face f, layer d, q quarter turns
        var f1,f2,f3,f4;
        var s2=size*size;
        var c,i,j,k;
        if(f>5)f-=6;
        // cycle the side facelets
        for(k=0; k<q; k++){
          for(i=0; i<size; i++){
            if(f===0){
              f1=6*s2-size*d-size+i;
              f2=2*s2-size*d-1-i;
              f3=3*s2-size*d-1-i;
              f4=5*s2-size*d-size+i;
            }else if(f===1){
              f1=3*s2+d+size*i;
              f2=3*s2+d-size*(i+1);
              f3=  s2+d-size*(i+1);
              f4=5*s2+d+size*i;
            }else if(f===2){
              f1=3*s2+d*size+i;
              f2=4*s2+size-1-d+size*i;
              f3=  d*size+size-1-i;
              f4=2*s2-1-d-size*i;
            }else if(f===3){
              f1=4*s2+d*size+size-1-i;
              f2=2*s2+d*size+i;
              f3=  s2+d*size+i;
              f4=5*s2+d*size+size-1-i;
            }else if(f===4){
              f1=6*s2-1-d-size*i;
              f2=size-1-d+size*i;
              f3=2*s2+size-1-d+size*i;
              f4=4*s2-1-d-size*i;
            }else if(f===5){
              f1=4*s2-size-d*size+i;
              f2=2*s2-size+d-size*i;
              f3=s2-1-d*size-i;
              f4=4*s2+d+size*i;
            }
            c=posit[f1];
            posit[f1]=posit[f2];
            posit[f2]=posit[f3];
            posit[f3]=posit[f4];
            posit[f4]=c;
          }
       
          /* turn face */
          if(d===0){
            for(i=0; i+i<size; i++){
              for(j=0; j+j<size-1; j++){
                f1=f*s2+         i+         j*size;
                f3=f*s2+(size-1-i)+(size-1-j)*size;
                if(f<3){
                  f2=f*s2+(size-1-j)+         i*size;
                  f4=f*s2+         j+(size-1-i)*size;
                }else{
                  f4=f*s2+(size-1-j)+         i*size;
                  f2=f*s2+         j+(size-1-i)*size;
                }
                c=posit[f1];
                posit[f1]=posit[f2];
                posit[f2]=posit[f3];
                posit[f3]=posit[f4];
                posit[f4]=c;
              }
            }
          }
        }
      }


      /*
       * Some helper functions.
       */

      var randomSource = undefined;

      // If we have a better (P)RNG:
      var setRandomSource = function(src) {
        randomSource = src;
      };


      var getRandomScramble = function() {
        scramble();
        imagestring(0);

        return {
          state: posit,
          scramble_string: scramblestring(0)
        };
      };

      var drawingInitialized = false;

      var initializeDrawing = function(continuation) {

        if (!drawingInitialized) {

          parse();

          drawingInitialized = true;
        }

        if (continuation) {
          setTimeout(continuation, 0);
        }
      };

      var initializeFull = function(continuation, iniRandomSource) {
    
      setRandomSource(iniRandomSource);

        initializeDrawing();

        if (continuation) {
          setTimeout(continuation, 0);
        }
      };


      /* mark2 interface */
      return {
        version: "December 29, 2011",
        initialize: initializeFull,
        setRandomSource: setRandomSource,
        getRandomScramble: getRandomScramble,
        drawScramble: drawScramble,

        /* Other methods */
      };

    })();
  }

  scramblers["222"] = generate_NNN_scrambler(2, 20, true);
  scramblers["333"] = generate_NNN_scrambler(3, 30, true);
  scramblers["444"] = generate_NNN_scrambler(4, 40, true);
  scramblers["555"] = generate_NNN_scrambler(5, 60, true);
  scramblers["666"] = generate_NNN_scrambler(6, 70, true);
  scramblers["777"] = generate_NNN_scrambler(7, 100, true);

})();

module.exports = scramblers;
},{}],2:[function(_dereq_,module,exports){
scrambler = (function() {
  /*
  function prt(p){
    if(p<10) document.write(" ");
    document.write(p+" ");
  }
  function prtrndpin(){
    prtpin(Math.floor(Math.random()*2));
  }
  function prtpin(p){
    document.write(p===0?"U":"d");
  }
  */
  
  function getRandomScramble(){
    var posit = new Array (0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0);
    var p = "dU";
    var pegs = [0, 0, 0, 0];
    var seq = new Array();
    var i,j;
    var moves = new Array();
    moves[0]=new Array(1,1,1,1,1,1,0,0,0,  -1,0,-1,0,0,0,0,0,0);
    moves[1]=new Array(0,1,1,0,1,1,0,1,1,  -1,0,0,0,0,0,-1,0,0);
    moves[2]=new Array(0,0,0,1,1,1,1,1,1,  0,0,0,0,0,0,-1,0,-1);
    moves[3]=new Array(1,1,0,1,1,0,1,1,0,  0,0,-1,0,0,0,0,0,-1);
  
    moves[4]=new Array(0,0,0,0,0,0,1,0,1,  0,0,0,-1,-1,-1,-1,-1,-1);
    moves[5]=new Array(1,0,0,0,0,0,1,0,0,  0,-1,-1,0,-1,-1,0,-1,-1);
    moves[6]=new Array(1,0,1,0,0,0,0,0,0,  -1,-1,-1,-1,-1,-1,0,0,0);
    moves[7]=new Array(0,0,1,0,0,0,0,0,1,  -1,-1,0,-1,-1,0,-1,-1,0);
  
    moves[ 8]=new Array(0,1,1,1,1,1,1,1,1,  -1,0,0,0,0,0,-1,0,-1);
    moves[ 9]=new Array(1,1,0,1,1,1,1,1,1,  0,0,-1,0,0,0,-1,0,-1);
    moves[10]=new Array(1,1,1,1,1,1,1,1,0,  -1,0,-1,0,0,0,0,0,-1);
    moves[11]=new Array(1,1,1,1,1,1,0,1,1,  -1,0,-1,0,0,0,-1,0,0);
  
    moves[12]=new Array(1,1,1,1,1,1,1,1,1,  -1,0,-1,0,0,0,-1,0,-1);
    moves[13]=new Array(1,0,1,0,0,0,1,0,1,  -1,-1,-1,-1,-1,-1,-1,-1,-1);
  
    for( i=0; i<14; i++){
      seq[i] = Math.floor(randomSource.random()*12)-5;
    }
  
    for( i=0; i<4; i++){
      pegs[i] = Math.floor(randomSource.random()*2);
    }
  
    for( i=0; i<14; i++){
      for( j=0; j<18; j++){
        posit[j]+=seq[i]*moves[i][j];
      }
    }
    for( j=0; j<18; j++){
      posit[j]%=12;
      while( posit[j]<=0 ) posit[j]+=12;
    }
  
  	var scramble = "";

  	function turns(top, bot, tUL, tUR, tDL, tDR) {
		var topWithChanges = top.replace(/\<\./g, "<span class='peg_changed'>").replace(/\<\_/g, "<span class='peg_same___'>").replace(/\>/g, "</span>");
		var botWithChanges = bot.replace(/\<\./g, "<span class='peg_changed'>").replace(/\<\_/g, "<span class='peg_same___'>").replace(/\>/g, "</span>");

  		scramble += "<div class='clock_outer'><div class='clock_inner'>";
  			scramble += tUL + " <span class='clock_pegs'>" + topWithChanges + "</span>&nbsp;" + tUR + "<br>";
  			scramble += tDL + " <span class='clock_pegs'>" + botWithChanges + "</span>&nbsp;" + tDR;
  		scramble += "</div></div>";
  	}

  	function turn_name(turn, amount) {
  		var suffix;
  		if (amount === 0) {
  			return "&nbsp;&nbsp;&nbsp;";
  		}
  		else if (amount === 1) {
  			suffix = "</span>&nbsp;&nbsp;";
  		}
  		else if (amount === -1) {
  			suffix = "'</span>&nbsp;&nbsp;";
  		}
  		else if (amount >= 0) {
  			suffix = "" + amount + "</span>&nbsp;";
  		}
  		else {
  			suffix = "" + (-amount) + "'</span>";
  		}
  		return "<span class='clock_turn'>" + turn + suffix;
  	}

/*
    turns("<_U><_U>", "<_d><_d>", "&nbsp;&nbsp;&nbsp;"  , turn_name("U", seq[0]) , "&nbsp;&nbsp;&nbsp;", turn_name("d", seq[4]));
    turns("<.d><_U>", "<_d><.U>", turn_name("d", seq[5]), turn_name("U", seq[1]) , "&nbsp;&nbsp;&nbsp;", "&nbsp;&nbsp;&nbsp;"  );
    turns("<_d><.d>", "<.U><_U>", "&nbsp;&nbsp;&nbsp;"  , turn_name("d", seq[6]) , "&nbsp;&nbsp;&nbsp;", turn_name("U", seq[2]));
    turns("<.U><_d>", "<_U><.d>", turn_name("U", seq[3]), turn_name("d", seq[7]) , "&nbsp;&nbsp;&nbsp;", "&nbsp;&nbsp;&nbsp;"  );
    turns("<.d><.U>", "<_U><.U>", "&nbsp;&nbsp;&nbsp;"  , turn_name("U", seq[8]) , "&nbsp;&nbsp;&nbsp;", "&nbsp;&nbsp;&nbsp;"  );
    turns("<.U><.d>", "<_U><_U>", turn_name("U", seq[9]), "&nbsp;&nbsp;&nbsp;"   , "&nbsp;&nbsp;&nbsp;", "&nbsp;&nbsp;&nbsp;"  );
    turns("<_U><.U>", "<_U><.d>", "&nbsp;&nbsp;&nbsp;"  , turn_name("U", seq[10]), "&nbsp;&nbsp;&nbsp;", "&nbsp;&nbsp;&nbsp;"  );
    turns("<_U><_U>", "<.d><.U>", "&nbsp;&nbsp;&nbsp;"  , turn_name("U", seq[11]), "&nbsp;&nbsp;&nbsp;", "&nbsp;&nbsp;&nbsp;"  );
    turns("<_U><_U>", "<.U><_U>", "&nbsp;&nbsp;&nbsp;"  , turn_name("U", seq[12]), "&nbsp;&nbsp;&nbsp;", "&nbsp;&nbsp;&nbsp;"  );
    turns("<.d><.d>", "<.d><.d>", "&nbsp;&nbsp;&nbsp;"  , turn_name("d", seq[13]), "&nbsp;&nbsp;&nbsp;", "&nbsp;&nbsp;&nbsp;"  )
    */

    turns("<_U><_U>", "<_d><_d>", ""  , turn_name("U", seq[0]) , "", turn_name("d", seq[4]) );
    turns("<.d><_U>", "<_d><.U>", ""  , turn_name("U", seq[1]) , "", turn_name("d", seq[5]) );
    turns("<_d><.d>", "<.U><_U>", ""  , turn_name("U", seq[2]) , "", turn_name("d", seq[6]) );
    turns("<.U><_d>", "<_U><.d>", ""  , turn_name("U", seq[3]) , "", turn_name("d", seq[7]) );
    turns("<.d><.U>", "<_U><.U>", ""  , turn_name("U", seq[8]) , "", "&nbsp;&nbsp;&nbsp;"   );
    turns("<.U><.d>", "<_U><_U>", ""  , turn_name("U", seq[9]) , "", "&nbsp;&nbsp;&nbsp;"   );
    turns("<_U><.U>", "<_U><.d>", ""  , turn_name("U", seq[10]), "", "&nbsp;&nbsp;&nbsp;"   );
    turns("<_U><_U>", "<.d><.U>", ""  , turn_name("U", seq[11]), "", "&nbsp;&nbsp;&nbsp;"   );
    turns("<_U><_U>", "<.U><_U>", ""  , turn_name("U", seq[12]), "", "&nbsp;&nbsp;&nbsp;"   );
    turns("<.d><.d>", "<.d><_d>", ""  , turn_name("d", seq[13]), "", "&nbsp;&nbsp;&nbsp;"   );
    turns(p[pegs[0]] + p[pegs[1]], p[pegs[2]] + p[pegs[3]], ""  , ""   , "", "");

    var scrambleString = "";

    var turnToString = function(turn, amount) {
      var suffix;
      if (amount === 0) {
        return "";
      }
      else if (amount === 1) {
        suffix = "";
      }
      else if (amount === -1) {
        suffix = "'";
      }
      else if (amount >= 0) {
        suffix = "" + amount + "";
      }
      else {
        suffix = "" + (-amount) + "'";
      }
      return " " + turn + suffix;
    }
    
    var addToScrambleString = function(pegs, UAmount, dAmount) {
      scrambleString += "[" + pegs + "]" + turnToString("U", UAmount) + turnToString("d", dAmount) +" ";
    }

    addToScrambleString("UU/dd", seq[0], seq[4]);
    addToScrambleString("dU/dU", seq[1], seq[5]);
    addToScrambleString("dd/UU", seq[2], seq[6]);
    addToScrambleString("Ud/Ud", seq[3], seq[7]);
    addToScrambleString("dU/UU", seq[8], 0);
    addToScrambleString("Ud/UU", seq[9], 0);
    addToScrambleString("UU/Ud", seq[10], 0);
    addToScrambleString("UU/dU", seq[11], 0);
    addToScrambleString("UU/UU", seq[12], 0);
    addToScrambleString("dd/dd", 0, seq[13]);
    addToScrambleString(p[pegs[0]] + p[pegs[1]] + "/" + p[pegs[2]] + p[pegs[3]], 0, 0);

    /*
    for( i=0; i<9; i++){
      prt(posit[i]);
      if( (i%3)===2 ) scramble += "\n";
    }
    scramble += "Back:\n";
    for( i=0; i<9; i++){
      prt(posit[i+9]);
      if( (i%3)===2 ) scramble += "\n";
    }
    */

    return {
      state: {dials: posit, pegs: pegs},
      scramble_string: scrambleString
    };
  }

  var randomSource = undefined;

  // If we have a better (P)RNG:
  var setRandomSource = function(src) {
    randomSource = src;
  }


  var initializeFull = function(continuation, iniRandomSource) {
  
    setRandomSource(iniRandomSource);
    
    if (continuation) {
      setTimeout(continuation, 0);
    }
  };

  var scalePoint = function(w, h, ptIn) {
    
    var defaultWidth = 220;
    var defaultHeight = 110;

    var scale = Math.min(w/defaultWidth, h/defaultHeight);

    var x = ptIn[0]*scale + (w - (defaultWidth * scale))/2;
    var y = ptIn[1]*scale + (h - (defaultHeight * scale))/2;

    return [x, y, scale];
  }

  function drawPolygon(r, w, h, fillColor, rrx, arry) {

    var pathString = "";
    for (var i = 0; i < arrx.length; i++) {
      var scaledPoint = scalePoint(w, h, [arrx[i], arry[i]]);
      pathString += ((i===0) ? "M" : "L") + scaledPoint[0] + "," + scaledPoint[1];
    }
    pathString += "z";

    return r.path(pathString).attr({fill: fillColor, stroke: "none"});
  }

  var drawCircle = function(r, w, h, cx, cy, rad, fillColor, stroke, stroke_width) {
    var scaledPoint = scalePoint(w, h, [cx, cy]);

    return r.circle(scaledPoint[0], scaledPoint[1], scaledPoint[2]*rad).attr({fill: fillColor, stroke: stroke, "stroke-width": stroke_width});
  }

  Math.TAU = Math.PI * 2;
  var arrx, arry;

  function drawClockFace(r, w, h, cx, cy, face_fill, hour) {

    var cxScaled = scalePoint(w, h, [cx, cy])[0];
    var cyScaled = scalePoint(w, h, [cx, cy])[1];

    drawCircle(r, w, h, cx, cy, 13, face_fill, "none", 0);
    drawCircle(r, w, h, cx, cy, 4, "#F00", "none", 0);

  	var c = Math.cos(hour/12*Math.TAU);
  	var s = Math.sin(hour/12*Math.TAU);

  	arrx = [cx , cx + 4	, cx - 4];
  	arry = [cy - 12, cy - 1, cy - 1];
  	
  	var hand = drawPolygon(r, w, h, "#F00", arrx, arry);

  	hand.rotate(30*hour, cxScaled, cyScaled);


    drawCircle(r, w, h, cx, cy, 2, "#FF0", "none", 0);

  	arrx = [cx, cx + 2, cx - 2];
  	arry = [cy - 8 , cy - 0.5, cy - 0.5];
  	
  	var handInner = drawPolygon(r, w, h, "#FF0", arrx, arry);

  	handInner.rotate(30*hour, cxScaled, cyScaled);

  }

  function drawPeg(r, w, h, cx, cy, pegValue) {

  	var pegRadius = 6;
  	var color;
  	if (pegValue === 1) {
  		color = "#FF0";
  	}
  	else {
  		color = "#440";
  	}

    drawCircle(r, w, h, cx, cy, pegRadius, color, "#000", "1px");
  }

  var drawScramble = function(parentElement, state, w, h) {

  	var clock_radius = 52;

  	var face_dist = 30;
  	var face_background_dist = 29;

  	var face_radius = 15;
  	var face_background_radius = 18;

    var r = Raphael(parentElement, w, h);

    var drawSideBackground = function(cx, cy, fill, stroke, stroke_width) {

      drawCircle(r, w, h, cx, cy, clock_radius, fill, stroke, stroke_width);

  		for (var x = cx - face_background_dist; x <= cx + face_background_dist; x += face_background_dist) {
  			for (var y = cy - face_background_dist; y <= cy + face_background_dist; y += face_background_dist) {
          drawCircle(r, w, h, x, y, face_background_radius, fill, stroke, stroke_width);
  			}
  		}
    }

    var cx = 55;
    var cy = 55;

    drawSideBackground(cx, cy, "none", "#000", "3px");
    drawSideBackground(cx, cy, "#36F", "none");

    var i = 0;
  	for (var y = cy - face_dist; y <= cy + face_dist; y += face_dist) {
  		for (var x = cx - face_dist; x <= cx + face_dist; x += face_dist) {
  			drawClockFace(r, w, h, x, y, "#8AF", state.dials[i]);
  			//console.log(state.dials[i]);
  			i++;
  		}
  	}
  	
  	drawPeg(r, w, h, cx - face_dist/2, cy - face_dist/2, state.pegs[0]);
  	drawPeg(r, w, h, cx + face_dist/2, cy - face_dist/2, state.pegs[1]);
  	drawPeg(r, w, h, cx - face_dist/2, cy + face_dist/2, state.pegs[2]);
  	drawPeg(r, w, h, cx + face_dist/2, cy + face_dist/2, state.pegs[3]);
  	


      var cx = 165;
      var cy = 55;

      drawSideBackground(cx, cy, "#none", "#000", 3);
      drawSideBackground(cx, cy, "#8AF", "none");

      var i = 9;
  	for (y = cy - face_dist; y <= cy + face_dist; y += face_dist) {
  		for (x = cx - face_dist; x <= cx + face_dist; x += face_dist) {
  			drawClockFace(r, w, h, x, y, "#36F",  state.dials[i]);
  			//console.log(state.dials[i]);
  			i++;
  		}
  	}
  	
  	drawPeg(r, w, h, cx + face_dist/2, cy - face_dist/2, 1-state.pegs[0]);
  	drawPeg(r, w, h, cx - face_dist/2, cy - face_dist/2, 1-state.pegs[1]);
  	drawPeg(r, w, h, cx + face_dist/2, cy + face_dist/2, 1-state.pegs[2]);
  	drawPeg(r, w, h, cx - face_dist/2, cy + face_dist/2, 1-state.pegs[3]);

  };

  return {
    /* mark2 interface */
    version: "December 30, 2011",
    initialize: initializeFull,
    setRandomSource: setRandomSource,
    getRandomScramble: getRandomScramble,
    drawScramble: drawScramble,

    /* Other methods */
  };
})();

module.exports = scrambler;
},{}],3:[function(_dereq_,module,exports){
/*

Program by Clément Gallet, based on earlier work by Jaap Scherphuis. Idea by Stefan Pochmann.

## Notation:
D means all layers below the U face together in one move.
R means all layers right from the L face together in one move.
++ means 2/5 move clockwise (144 degrees), -- means 2/5 move counterclockwise (-144 degrees).
U is the regular move of the U face, according to standard cube notation.
<br>
 */

scrambler = (function() {
 
  var linelen=10;
  var linenbr=7;
  
  function parse() {
  	/*
  	var urlquery=location.href.split("?")
  	if(urlquery.length>1){
  		var urlterms=urlquery[1].split("&")
  		for( var i=0; i<urlterms.length; i++){
  			var urllr=urlterms[i].split("=");
  			if(urllr[0]==="ll") {
  				if(urllr[1]-0 >= 1 ) linelen=urllr[1]-0;
  			} else if(urllr[0]==="ln"){
  				if(urllr[1]-0 >= 1 ) linenbr=urllr[1]-0;
  			} else if(urllr[0]==="num"){
  				if(urllr[1]-0 >= 1 ) numcub=urllr[1]-0;
  			}
  		}
  	}
  	*/
  }


  var permU = [4, 0, 1, 2, 3, 9, 5, 6, 7, 8, 10, 11, 12, 13, 58, 59, 16, 17, 18, 63, 20, 21, 22, 23, 24, 14, 15, 27, 28, 29, 19, 31, 32, 33, 34, 35, 25, 26, 38, 39, 40, 30, 42, 43, 44, 45, 46, 36, 37, 49, 50, 51, 41, 53, 54, 55, 56, 57, 47, 48, 60, 61, 62, 52, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131];
  var permUi = [1, 2, 3, 4, 0, 6, 7, 8, 9, 5, 10, 11, 12, 13, 25, 26, 16, 17, 18, 30, 20, 21, 22, 23, 24, 36, 37, 27, 28, 29, 41, 31, 32, 33, 34, 35, 47, 48, 38, 39, 40, 52, 42, 43, 44, 45, 46, 58, 59, 49, 50, 51, 63, 53, 54, 55, 56, 57, 14, 15, 60, 61, 62, 19, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131];
  var permD2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 33, 34, 35, 14, 15, 38, 39, 40, 19, 42, 43, 44, 45, 46, 25, 26, 49, 50, 51, 30, 53, 54, 55, 56, 57, 36, 37, 60, 61, 62, 41, 64, 65, 11, 12, 13, 47, 48, 16, 17, 18, 52, 20, 21, 22, 23, 24, 58, 59, 27, 28, 29, 63, 31, 32, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 124, 125, 121, 122, 123, 129, 130, 126, 127, 128, 131];
  var permD2i = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 44, 45, 46, 14, 15, 49, 50, 51, 19, 53, 54, 55, 56, 57, 25, 26, 60, 61, 62, 30, 64, 65, 11, 12, 13, 36, 37, 16, 17, 18, 41, 20, 21, 22, 23, 24, 47, 48, 27, 28, 29, 52, 31, 32, 33, 34, 35, 58, 59, 38, 39, 40, 63, 42, 43, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 123, 124, 125, 121, 122, 128, 129, 130, 126, 127, 131];
  var permR2 = [81, 77, 78, 3, 4, 86, 82, 83, 8, 85, 87, 122, 123, 124, 125, 121, 127, 128, 129, 130, 126, 131, 89, 90, 24, 25, 88, 94, 95, 29, 97, 93, 98, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 26, 22, 23, 48, 30, 31, 27, 28, 53, 32, 69, 70, 66, 67, 68, 74, 75, 71, 72, 73, 76, 101, 102, 103, 99, 100, 106, 107, 108, 104, 105, 109, 46, 47, 79, 80, 45, 51, 52, 84, 49, 50, 54, 0, 1, 2, 91, 92, 5, 6, 7, 96, 9, 10, 15, 11, 12, 13, 14, 20, 16, 17, 18, 19, 21, 113, 114, 110, 111, 112, 118, 119, 115, 116, 117, 120, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65];
  var permR2i = [88, 89, 90, 3, 4, 93, 94, 95, 8, 97, 98, 100, 101, 102, 103, 99, 105, 106, 107, 108, 104, 109, 46, 47, 24, 25, 45, 51, 52, 29, 49, 50, 54, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 81, 77, 78, 48, 85, 86, 82, 83, 53, 87, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 57, 58, 59, 55, 56, 62, 63, 64, 60, 61, 65, 1, 2, 79, 80, 0, 6, 7, 84, 9, 5, 10, 26, 22, 23, 91, 92, 31, 27, 28, 96, 30, 32, 69, 70, 66, 67, 68, 74, 75, 71, 72, 73, 76, 112, 113, 114, 110, 111, 117, 118, 119, 115, 116, 120, 15, 11, 12, 13, 14, 20, 16, 17, 18, 19, 21];

   function applyMove(state, movePerm) {
   	 var stateNew = [];
  	 for (var i = 0; i < 11*12; i++) {
  		stateNew[i] = state[movePerm[i]];
  	 }
  	 return stateNew;
   }
  
  function getRandomScramble(){

	var i;
	var seq =new Array();
	for(i=0; i<linenbr*linelen; i++){
		seq[i]=Math.floor(randomSource.random()*2);
	}

  	var s="",i,j;

  	var state = [];
  	for (i = 0; i < 12; i++) {
  		for (j = 0; j < 11; j++) {
  			state[i*11+j] = i;
  		}
  	}

  	for(j=0; j<linenbr; j++){
  		for(i=0; i<linelen; i++){
  			if (i%2)
  			{
  				if (seq[j*linelen + i]) {
	  				s+="D++ ";
	  				state = applyMove(state, permD2);
	  			}
  				else {
	  				s+="D-- ";
	  				state = applyMove(state, permD2i);
	  			}
  			}
  			else
  			{
  				if (seq[j*linelen + i]) {
	  				s+="R++ ";
	  				state = applyMove(state, permR2);
	  			}
  				else {
	  				s+="R-- ";
	  				state = applyMove(state, permR2i);
  				}
  			}
  		}
  		if (seq[(j+1)*linelen - 1]) {
	  		s+="U";
	  		state = applyMove(state, permU);
	  	}
  		else {
	  		s+="U'";
			state = applyMove(state, permUi);
	  	}
  		if (j < linenbr-1) {
  			s += "<br>";
  		}
  	}

    return {
      state: state,
      scramble_string: s
    };
  }
  
  var randomSource = undefined;

  // If we have a better (P)RNG:
  var setRandomSource = function(src) {
    randomSource = src;
  }

  var initializeFull = function(continuation, iniRandomSource) {
  
    setRandomSource(iniRandomSource);
    
    if (continuation) {
      setTimeout(continuation, 0);
    }
  };


  /*
   * Drawing code.
   * Messy, but it works.
   */
  var edgeFrac = (1+Math.sqrt(5))/4;
  var centerFrac = 0.5;

  Math.TAU = Math.PI * 2;

  var s18 = function(i) {return Math.sin(Math.TAU*i/20);};
  var c18 = function(i) {return Math.cos(Math.TAU*i/20);};

  var colors = [
  	"#FFF",
  	"#008",
  	"#080",
  	"#0FF",
  	"#822",
  	"#8AF",

  	"#F00",
  	"#00F",
  	"#F0F",
  	"#0F0",
  	"#F80",
  	"#FF0",

  ];

	function drawPolygon(r, fillColor, arrx, arry) {

	  var pathString = "";
	  for (var i = 0; i < arrx.length; i++) {
	    pathString += ((i===0) ? "M" : "L") + arrx[i] + "," + arry[i];
	  }
	  pathString += "z";

	  return r.path(pathString).attr({fill: fillColor, stroke: "#000"});
	}

  var drawScramble = function(parentElement, state, w, h) {



    var defaultWidth = 350;
    var defaultHeight = 180;

    var scale = Math.min(w/defaultWidth, h/defaultHeight);

    var dx = (w - (defaultWidth * scale))/2;
    var dy = (h - (defaultHeight * scale))/2;


    // Change this if the SVG element is too large.
    
    var majorR = 36*scale;
    var minorR = majorR * edgeFrac

    var pentR = minorR*2;

    var cx1 = 92*scale + dx;
    var cy1 = 80*scale + dy;

    var cx2 = cx1 + c18(1)*3*pentR;
    var cy2 = cy1 + s18(1)*1*pentR;

    var trans = [
      [0, cx1, cy1, 0, 0],
      [36, cx1, cy1, 1, 1],
      [36+72*1, cx1, cy1, 1, 5],
      [36+72*2, cx1, cy1, 1, 9],
      [36+72*3, cx1, cy1, 1, 13],
      [36+72*4, cx1, cy1, 1, 17],
      [0, cx2, cy2, 1, 7],
      [-72*1, cx2, cy2, 1, 3],
      [-72*2, cx2, cy2, 1, 19],
      [-72*3, cx2, cy2, 1, 15],
      [-72*4, cx2, cy2, 1, 11],
      [36+72*2, cx2, cy2, 0, 0]
    ];

    var r = Raphael(parentElement, w, h);

    //console.log(state);

    var index = 0;

    for (var side = 0; side < 12; side++) {

	    for (var i = 0; i < 5; i++) {

	    	var dx = majorR*(1-centerFrac)/2/Math.tan(Math.TAU/10);
	    	var arrx = [0, dx, 0, -dx];
	    	var arry = [-majorR,- majorR*(1+centerFrac)/2, -majorR*centerFrac, -majorR*(1+centerFrac)/2]

	    	var p = drawPolygon(r, colors[state[index++]], arrx, arry);
	    	//var p = r.circle(0, - circR, circRadius);
	    	//p.attr({fill: colors[state[index++]], stroke: "#000"});
	    	p.translate(trans[side][1] + trans[side][3]*c18(trans[side][4])*pentR, trans[side][2] + trans[side][3]*s18(trans[side][4])*pentR);
			p.rotate(72*i + trans[side][0], 0, 0);
	    }

	    for (var i = 0; i < 5; i++) {

	    	var sx = Math.tan(Math.TAU/10);
	    	var arrx = [c18(-1)*majorR - dx, dx, 0, s18(4)*centerFrac*majorR];
	    	var arry = [s18(-1)*majorR - majorR + majorR*(1+centerFrac)/2,- majorR*(1+centerFrac)/2, -majorR*centerFrac, -c18(4)*centerFrac*majorR]

	    	var p = drawPolygon(r, colors[state[index++]], arrx, arry);
	    	p.translate(trans[side][1] + trans[side][3]*c18(trans[side][4])*pentR, trans[side][2] + trans[side][3]*s18(trans[side][4])*pentR);
	    	p.rotate(72*i + trans[side][0], 0, 0);
	    }

	    var arrx = [s18(0)*centerFrac*majorR, s18(4)*centerFrac*majorR, s18(8)*centerFrac*majorR, s18(12)*centerFrac*majorR, s18(16)*centerFrac*majorR];
	    var arry = [-c18(0)*centerFrac*majorR, -c18(4)*centerFrac*majorR, -c18(8)*centerFrac*majorR, -c18(12)*centerFrac*majorR, -c18(16)*centerFrac*majorR];

	    var p = drawPolygon(r, colors[state[index++]], arrx, arry);
	    p.translate(trans[side][1] + trans[side][3]*c18(trans[side][4])*pentR, trans[side][2] + trans[side][3]*s18(trans[side][4])*pentR);
	    p.rotate(trans[side][0], 0, 0);
	}

	//console.log(index);

  };

  
  return {
    /* mark2 interface */
    version: "December 29, 2011",
    initialize: initializeFull,
    setRandomSource: setRandomSource,
    getRandomScramble: getRandomScramble,
    drawScramble: drawScramble,

    /* Other methods */
  };
})();


module.exports = scrambler;
},{}],4:[function(_dereq_,module,exports){
/* Base script written by Jaap Scherphuis, jaapsch a t yahoo d o t com */
/* Javascript written by Syoji Takamatsu, , red_dragon a t honki d o t net */
/* Random-State modification by Lucas Garron (lucasg a t gmx d o t de / garron.us) in collaboration with Michael Gottlieb (mzrg.com)*/
/* Optimal modification by Michael Gottlieb (qqwref a t gmail d o t com) from Jaap's code */
/* Version 1.0*/

scrambler = (function() {

  var numcub = 1;

  var colorString = "xgryb";  //In dlburf order. May use any colours in colorList below

   
  // list of available colours
  var colorList = [
   'g', "green.jpg",  "green",
   'r', "red.jpg",    "red",
   'y', "yellow.jpg", "yellow",
   'b', "blue.jpg",   "blue",
   'w', "white.jpg",  "white",
   'o', "orange.jpg","orange",   // 'orange' is not an official html colour name
   'p', "purple.jpg", "purple",
   '0', "gray.jpg",   "grey"      // used for unrecognised letters, or when zero used.
  ];
  // layout
  var layout =
   [1,2,1,2,1,0,2,0,1,2,1,2,1,
    0,1,2,1,0,2,1,2,0,1,2,1,0,
    0,0,1,0,2,1,2,1,2,0,1,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,1,2,1,2,1,0,0,0,0,
    0,0,0,0,0,1,2,1,0,0,0,0,0,
    0,0,0,0,0,0,1,0,0,0,0,0,0];
   
  var seq   = []; // move sequences
  var colmap = []; // color map
  var colors = []; //stores colours used
  var scramblestring = [];
   
  function parse() {

    /*
   var s = "";
   var urlquery = location.href.split("?")
   if(urlquery.length > 1) {
    var urlterms = urlquery[1].split("&")
    for( var i = 0; i < urlterms.length; i++) {
     var urllr = urlterms[i].split("=");
     if(urllr[0] == "num") {
      if(urllr[1] - 0 >= 1 ) 
       numcub = urllr[1] - 0;
     } 
     else if(urllr[0] == "col") {
      if(urllr[1].length==4) 
       colorString = urllr[1];
     }
    }
   }
   */

   // expand colour string into 6 actual html color names
   for(var k = 0; k < 6; k++){
    colors[k+1] = colorList.length - 3; // gray
    for( var i = 0; i < colorList.length; i += 3) {
     if( colorString.charAt(k) == colorList[i]) {
      colors[k+1] = i; // not use index 0
      break;
     }
    }
   }
  }
  parse();
   
  function init_colors(n){
   colmap[n] =
    [1,1,1,1,1,0,2,0,3,3,3,3,3,
     0,1,1,1,0,2,2,2,0,3,3,3,0,
     0,0,1,0,2,2,2,2,2,0,3,0,0,
     0,0,0,0,0,0,0,0,0,0,0,0,0,
     0,0,0,0,4,4,4,4,4,0,0,0,0,
     0,0,0,0,0,4,4,4,0,0,0,0,0,
     0,0,0,0,0,0,4,0,0,0,0,0,0];
  }
   
  function scramble()
  {
   var i, j, n, ls, t;
   
   for( n = 0; n < numcub; n++){
    initbrd();
    dosolve();
   
    scramblestring[n]="";
    init_colors(n);
    for (i=0;i<sol.length;i++) {
     scramblestring[n] += ["U","L","R","B"][sol[i]&7] + ["","'"][(sol[i]&8)/8] + " ";
     picmove([3,0,1,2][sol[i]&7],1+(sol[i]&8)/8,n);
    }
    var tips=["l","r","b","u"];
    for (i=0;i<4;i++) {
     var j = Math.floor(randomSource.random() * 3);
     if (j < 2) {
      scramblestring[n] += tips[i] + ["","'"][j] + " ";
      picmove(4+i,1+j,n);
     }
    }
   }
  }
   
  var posit = [];
  var mode;
  var edt;
  var perm=[];   // pruning table for edge permutation
  var twst=[];   // pruning table for edge orientation+twist
  var permmv=[]; // transition table for edge permutation
  var twstmv=[]; // transition table for edge orientation+twist
  var sol=[];
  var pcperm = [];
  var pcori  = [];
  var soltimer;
   
  function initbrd(){
      if( mode==4 ) clearTimeout(soltimer);
      posit = [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3];
      mode=0;
      sol.length=0;
  }
   
  function solved(){
      for (var i=1;i<9; i++){
          if( posit[i   ]!=posit[0 ] ) return(false);
          if( posit[i+9 ]!=posit[9 ] ) return(false);
          if( posit[i+18]!=posit[18] ) return(false);
          if( posit[i+27]!=posit[27] ) return(false);
      }
      return(true);
  }
   
  var edges = [2,11, 1,20, 4,31, 10,19, 13,29, 22,28];
   
  var movelist=[];
  movelist[0 ]=[0, 18,9,   6, 24,15,  1, 19,11,  2, 20,10];  //U
  movelist[1 ]=[23,3, 30,  26,7, 34,  22,1, 31,  20,4, 28];  //L
  movelist[2 ]=[5, 14,32,  8, 17,35,  4, 11,29,  2, 13,31];  //R
  movelist[3 ]=[12,21,27,  16,25,33,  13,19,28,  10,22,29];  //B
   
  function domove(m){
      for(var i=0;i<movelist[m].length; i+=3){
          var c=posit[movelist[m][i]];
          posit[movelist[m][i  ]]=posit[movelist[m][i+2]];
          posit[movelist[m][i+2]]=posit[movelist[m][i+1]];
          posit[movelist[m][i+1]]=c;
      }
  }
   
  function dosolve(){
      var a,b,c,l,t=0,q=0;
      // Get a random permutation and orientation.
      var parity = 0;
      pcperm = [0,1,2,3,4,5];
      for (var i=0;i<4;i++) {
       var other = i + Math.floor((6-i) * randomSource.random());
       var temp = pcperm[i];
       pcperm[i] = pcperm[other];
       pcperm[other] = temp;
       if (i != other) parity++;
      }
      if (parity%2 == 1) {
       var temp = pcperm[4];
       pcperm[4] = pcperm[5];
       pcperm[5] = temp;
      }
      parity=0;
      pcori = [];
      for (var i=0;i<5;i++) {
       pcori[i] = Math.floor(2 * randomSource.random());
       parity += pcori[i];
      }
      pcori[5] = parity % 2;
      for (var i=6;i<10;i++) {
       pcori[i] = Math.floor(3 * randomSource.random());
      }
   
      for(a=0;a<6;a++){
          b=0;
          for(c=0;c<6;c++){
              if(pcperm[c]==a)break;
              if(pcperm[c]>a)b++;
          }
          q=q*(6-a)+b;
      }
      //corner orientation
      for(a=9;a>=6;a--){
          t=t*3+pcori[a];
      }
      //edge orientation
      for(a=4;a>=0;a--){
          t=t*2+pcori[a];
      }
   
      // solve it
      if(q!=0 || t!=0){
          for(l=7;l<12;l++){  //allow solutions from 7 through 11 moves
              if(search(q,t,l,-1)) break;
          }
      }
  }
   
  function search(q,t,l,lm){
      //searches for solution, from position q|t, in l moves exactly. last move was lm, current depth=d
      if(l==0){
          if(q==0 && t==0){
              return(true);
          }
      }else{
          if(perm[q]>l || twst[t]>l) return(false);
          var p,s,a,m;
          for(m=0;m<4;m++){
              if(m!=lm){
                  p=q; s=t;
                  for(a=0;a<2;a++){
                      p=permmv[p][m];
                      s=twstmv[s][m];
                      sol[sol.length]=m+8*a;
                      if(search(p,s,l-1,m)) return(true);
                      sol.length--;
                  }
              }
          }
      }
      return(false);
  }
   
   
  function calcperm(){
      var c,p,q,l,m,n;
      //calculate solving arrays
      //first permutation
      // initialise arrays
      for(p=0;p<720;p++){
          perm[p]=-1;
          permmv[p]=[];
          for(m=0;m<4;m++){
              permmv[p][m]=getprmmv(p,m);
          }
      }
      //fill it
      perm[0]=0;
      for(l=0;l<=6;l++){
          n=0;
          for(p=0;p<720;p++){
              if(perm[p]==l){
                  for(m=0;m<4;m++){
                      q=p;
                      for(c=0;c<2;c++){
                          q=permmv[q][m];
                          if(perm[q]==-1) { perm[q]=l+1; n++; }
                      }
                  }
              }
          }
      }
      //then twist
      // initialise arrays
      for(p=0;p<2592;p++){
          twst[p]=-1;
          twstmv[p]=[];
          for(m=0;m<4;m++){
              twstmv[p][m]=gettwsmv(p,m);
          }
      }
      //fill it
      twst[0]=0;
      for(l=0;l<=5;l++){
          n=0;
          for(p=0;p<2592;p++){
              if(twst[p]==l){
                  for(m=0;m<4;m++){
                      q=p;
                      for(c=0;c<2;c++){
                          q=twstmv[q][m];
                          if(twst[q]==-1) { twst[q]=l+1; n++; }
                      }
                  }
              }
          }
      }
  }
   
  function getprmmv(p,m){
      //given position p<720 and move m<4, return new position number
   
      //convert number into array
      var a,b,c;
      var ps=[];
      var q=p;
      for(a=1;a<=6;a++){
          c=Math.floor(q/a);
          b=q-a*c;
          q=c;
          for(c=a-1;c>=b;c--) ps[c+1]=ps[c];
          ps[b]=6-a;
      }
      //perform move on array
      if(m==0){
          //U
          cycle3(ps, 0, 3, 1);
      }else if(m==1){
          //L
          cycle3(ps, 1, 5, 2);
      }else if(m==2){
          //R
          cycle3(ps, 0, 2, 4);
      }else if(m==3){
          //B
          cycle3(ps, 3, 4, 5);
      }
      //convert array back to number
      q=0;
      for(a=0;a<6;a++){
          b=0;
          for(c=0;c<6;c++){
              if(ps[c]==a)break;
              if(ps[c]>a)b++;
          }
          q=q*(6-a)+b;
      }
      return(q)
  }
  function gettwsmv(p,m){
      //given position p<2592 and move m<4, return new position number
   
      //convert number into array;
      var a,b,c,d=0;
      var ps=[];
      var q=p;
   
      //first edge orientation
      for(a=0;a<=4;a++){
          ps[a]=q&1;
          q>>=1;
          d^=ps[a];
      }
      ps[5]=d;
   
      //next corner orientation
      for(a=6;a<=9;a++){
          c=Math.floor(q/3);
          b=q-3*c;
          q=c;
          ps[a]=b;
      }
   
      //perform move on array
      if(m==0){
          //U
          ps[6]++; if(ps[6]==3) ps[6]=0;
          cycle3(ps, 0, 3, 1);
          ps[1]^=1;ps[3]^=1;
      }else if(m==1){
          //L
          ps[7]++; if(ps[7]==3) ps[7]=0;
          cycle3(ps, 1, 5, 2);
          ps[2]^=1; ps[5]^=1;
      }else if(m==2){
          //R
          ps[8]++; if(ps[8]==3) ps[8]=0;
          cycle3(ps, 0, 2, 4);
          ps[0]^=1; ps[2]^=1;
      }else if(m==3){
          //B
          ps[9]++; if(ps[9]==3) ps[9]=0;
          cycle3(ps, 3, 4, 5);
          ps[3]^=1; ps[4]^=1;
      }
      //convert array back to number
      q=0;
      //corner orientation
      for(a=9;a>=6;a--){
          q=q*3+ps[a];
      }
      //corner orientation
      for(a=4;a>=0;a--){
          q=q*2+ps[a];
      }
      return(q);
  }
   
  function picmove(type, direction, n){
   switch(type) {
    case 0: // L
     rotate3(n, 14,58,18, direction);
     rotate3(n, 15,57,31, direction);
     rotate3(n, 16,70,32, direction);
     rotate3(n, 30,28,56, direction);
     break;
    case 1: // R
     rotate3(n, 32,72,22, direction);
     rotate3(n, 33,59,23, direction);
     rotate3(n, 20,58,24, direction);
     rotate3(n, 34,60,36, direction);
     break;
    case 2: // B
     rotate3(n, 14,10,72, direction);
     rotate3(n,  1,11,71, direction);
     rotate3(n,  2,24,70, direction);
     rotate3(n,  0,12,84, direction);
     break;
    case 3: // U
     rotate3(n,  2,18,22, direction);
     rotate3(n,  3,19, 9, direction);
     rotate3(n, 16,20,10, direction);
     rotate3(n,  4, 6, 8, direction);
     break;
    case 4: // l
     rotate3(n, 30,28,56, direction);
     break;
    case 5: // r
     rotate3(n, 34,60,36, direction);
     break;
    case 6: // b
     rotate3(n,  0,12,84, direction);
     break;
    case 7: // u
     rotate3(n,  4, 6, 8, direction);
     break;
   }
  }
   
  function rotate3(n, v1, v2, v3, clockwise)
  {
   if(clockwise == 2) {
    cycle3(colmap[n], v3, v2, v1);
   } else {
    cycle3(colmap[n], v1, v2, v3);
   }
  }
   
  function cycle3(arr, i1, i2, i3) {
   var c = arr[i1];
   arr[i1] = arr[i2];
   arr[i2] = arr[i3];
   arr[i3] = c;
  }
   
  function draw_triangle(pat, color, val)
  {
     var s = "";
     if(pat == 1) {
        s += "<table border=0 cellpadding=0 cellspacing=0>";
        s += "<tr>";
        for(var c=1; c<=12; c++){
           s += "<td width=1 height=2><img src='scrbg/" +colorList[colors[color] + 1] +  "' height='2px' width='1px'></td>";
        }
        s += "</tr>";
   
        for(var i = 1; i <= 5; i++) {
           s += "<tr>";
           s += "<td colspan=" + i + " width=" + i + " height=2 bgcolor=silver></td>";
           s += "<td colspan=" + (12 - i * 2) + " width=" + (12 - i * 2) + " height=2><img src='scrbg/" +colorList[colors[color] + 1] +  "' height='2px' width='"+(12 - i * 2)+"px'></td>";
           s += "<td colspan=" + i + " width=" + i + " height=2 bgcolor=silver></td>";
           s += "</tr>";
        }
   
        s += "</table>";
     }
     else if(pat == 2) {
        s += "<table border=0 cellpadding=0 cellspacing=0>";
        for(var i = 5; i >= 1; i--) {
           s += "<tr>";
           s += "<td colspan=" + i + " width=" + i + " height=2 bgcolor=silver></td>";
           s += "<td colspan=" + (12 - i * 2) + " width=" + (12 - i * 2) + " height=2><img src='scrbg/" +colorList[colors[color] + 1] +  "' height='2px' width='"+(12 - i * 2)+"px'></td>";
           s += "<td colspan=" + i + " width=" + i + " height=2 bgcolor=silver></td>";
           s += "</tr>";
        }
   
        s += "<tr>";
        for(var c=1; c<=12; c++){
           s += "<td width=1 height=2><img src='scrbg/" +colorList[colors[color] + 1] +  "' height='2px' width='1px'></td>";
        }
        s += "</tr>";
        s += "</table>";
     }
     else {
        s += "&nbsp;";
     }
     return s;
  }
   
  function imagetable(n)
  {
  	var x,y;
  	var s = "<table border=0 cellpadding=0 cellspacing=0>";
   
  	for(var y = 0; y < 7; y++) {
  		s += "<tr>";
  		for(var x = 0; x < 13; x++) {
  			s += "<td>";
  			s += draw_triangle(layout[y * 13 + x], colmap[n][y * 13 + x], "");
  			s += "</td>";
  		}
  		s += "</tr>";
  	}
  	s += "</table>";
  	return s;
  }

  /* Methods added by Lucas. */

  var randomSource = undefined;

  // If we have a better (P)RNG:
  var setRandomSource = function(src) {
    randomSource = src;
  }


  var getRandomScramble = function() {
    scramble();

    return {
      state: colmap,
      scramble_string: scramblestring[0]
    };
  };

  var initializeFull = function(continuation, iniRandomSource) {
  
    setRandomSource(iniRandomSource);
    
    parse();
    calcperm();

    if (continuation) {
      setTimeout(continuation, 0);
    }
  };



  var border = 15;
  var width = 18;
  //URFLBD
  var drawingCenters = [
    [border + width/2*1, border + width/2*1],
    [border + width/2*5, border + width/2*3],
    [border + width/2*3, border + width/2*3],
    [border + width/2*1, border + width/2*3],
    [border + width/2*7, border + width/2*3],
    [border + width/2*3, border + width/2*5],
  ];


  function colorGet(col){
    if (col=="r") return ("#FF0000");
    if (col=="o") return ("#FF8000");
    if (col=="b") return ("#0000FF");
    if (col=="g") return ("#00FF00");
    if (col=="y") return ("#FFFF00");
    if (col=="w") return ("#FFFFFF");
    if (col=="x") return ("#000000");
  }

  var scalePoint = function(w, h, ptIn) {

    var defaultWidth = border*2+width*9;
    var defaultHeight = border*2+width*5.3;
    

    var scale = Math.min(w/defaultWidth, h/defaultHeight);

    var x = ptIn[0]*scale + (w - (defaultWidth * scale))/2;
    var y = ptIn[1]*scale + (h - (defaultHeight * scale))/2;

    return [x, y];
  }

  function drawTriangle(r, canvasWidth, canvasHeight, cx, cy, w, h, direction, fillColor) {

    var dM = 1; // Direction Multiplier
    if (direction == 2) {
      dM = -1;
    }

    var arrx = [cx, cx - w, cx + w];
    var arry = [cy + h * dM, cy - h * dM, cy - h * dM];

    var pathString = "";
    for (var i = 0; i < arrx.length; i++) {
      var scaledPoint = scalePoint(canvasWidth, canvasHeight, [arrx[i], arry[i]]);
      pathString += ((i===0) ? "M" : "L") + scaledPoint[0] + "," + scaledPoint[1];
    }
    pathString += "z";
      
    r.path(pathString).attr({fill: colorGet(fillColor), stroke: "#000"})
  }

  var drawScramble = function(parentElement, state, w, h) {

    var r = Raphael(parentElement, w, h);

    for(var y = 0; y < 7; y++) {
      for(var x = 0; x < 13; x++) {
        var col = state[0][y * 13 + x];
        if (col != 0) {
          var xx = border + width + x*width/2*2/Math.sqrt(3);
          var yy = border + y * width;
          if (y > 3) {
            yy -= width/2;
          }
          drawTriangle(r, w, h, xx, yy, width/2*2/Math.sqrt(3), width/2, layout[y * 13 + x], colorString[col]);
        }
      }
    }

  }

  return {
    /* mark2 interface */
    version: "December 29, 2011",
    initialize: initializeFull,
    setRandomSource: setRandomSource,
    getRandomScramble: getRandomScramble,
    drawScramble: drawScramble,

    /* Other methods */
  };
})();

module.exports = scrambler;
},{}],5:[function(_dereq_,module,exports){
/*

scramble_sq1.js

Square-1 Solver / Scramble Generator in Javascript.

Code by by Shuang Chen.
Compiled to Javascript using GWT.

*/

scrambler = (function() {


function nullMethod(){
}

function FullCube_copy(obj, c){
  obj.ul = c.ul;
  obj.ur = c.ur;
  obj.dl = c.dl;
  obj.dr = c.dr;
  obj.ml = c.ml;
}

function FullCube_doMove(obj, move){
  var temp;
  move <<= 2;
  if (move > 24) {
    move = 48 - move;
    temp = obj.ul;
    obj.ul = (~~obj.ul >> move | obj.ur << 24 - move) & 16777215;
    obj.ur = (~~obj.ur >> move | temp << 24 - move) & 16777215;
  }
   else if (move > 0) {
    temp = obj.ul;
    obj.ul = (obj.ul << move | ~~obj.ur >> 24 - move) & 16777215;
    obj.ur = (obj.ur << move | ~~temp >> 24 - move) & 16777215;
  }
   else if (move == 0) {
    temp = obj.ur;
    obj.ur = obj.dl;
    obj.dl = temp;
    obj.ml = 1 - obj.ml;
  }
   else if (move >= -24) {
    move = -move;
    temp = obj.dl;
    obj.dl = (obj.dl << move | ~~obj.dr >> 24 - move) & 16777215;
    obj.dr = (obj.dr << move | ~~temp >> 24 - move) & 16777215;
  }
   else if (move < -24) {
    move = 48 + move;
    temp = obj.dl;
    obj.dl = (~~obj.dl >> move | obj.dr << 24 - move) & 16777215;
    obj.dr = (~~obj.dr >> move | temp << 24 - move) & 16777215;
  }
}

function FullCube_getParity(obj){
  var a, b, cnt, i, p;
  cnt = 0;
  obj.arr[0] = FullCube_pieceAt(obj, 0);
  for (i = 1; i < 24; ++i) {
    FullCube_pieceAt(obj, i) != obj.arr[cnt] && (obj.arr[++cnt] = FullCube_pieceAt(obj, i));
  }
  p = 0;
  for (a = 0; a < 16; ++a) {
    for (b = a + 1; b < 16; ++b) {
      obj.arr[a] > obj.arr[b] && (p ^= 1);
    }
  }
  return p;
}

function FullCube_getShapeIdx(obj){
  var dlx, drx, ulx, urx;
  urx = obj.ur & 1118481;
  urx |= ~~urx >> 3;
  urx |= ~~urx >> 6;
  urx = urx & 15 | ~~urx >> 12 & 48;
  ulx = obj.ul & 1118481;
  ulx |= ~~ulx >> 3;
  ulx |= ~~ulx >> 6;
  ulx = ulx & 15 | ~~ulx >> 12 & 48;
  drx = obj.dr & 1118481;
  drx |= ~~drx >> 3;
  drx |= ~~drx >> 6;
  drx = drx & 15 | ~~drx >> 12 & 48;
  dlx = obj.dl & 1118481;
  dlx |= ~~dlx >> 3;
  dlx |= ~~dlx >> 6;
  dlx = dlx & 15 | ~~dlx >> 12 & 48;
  return Shape_getShape2Idx(FullCube_getParity(obj) << 24 | ulx << 18 | urx << 12 | dlx << 6 | drx);
}

function FullCube_getSquare(obj, sq){
  var a, b;
  for (a = 0; a < 8; ++a) {
    obj.prm[a] = ~~(~~FullCube_pieceAt(obj, a * 3 + 1) >> 1 << 24) >> 24;
  }
  sq.cornperm = get8Perm(obj.prm);
  sq.topEdgeFirst = FullCube_pieceAt(obj, 0) == FullCube_pieceAt(obj, 1);
  a = sq.topEdgeFirst?2:0;
  for (b = 0; b < 4; a += 3 , ++b)
    obj.prm[b] = ~~(~~FullCube_pieceAt(obj, a) >> 1 << 24) >> 24;
  sq.botEdgeFirst = FullCube_pieceAt(obj, 12) == FullCube_pieceAt(obj, 13);
  a = sq.botEdgeFirst?14:12;
  for (; b < 8; a += 3 , ++b)
    obj.prm[b] = ~~(~~FullCube_pieceAt(obj, a) >> 1 << 24) >> 24;
  sq.edgeperm = get8Perm(obj.prm);
  sq.ml = obj.ml;
}

function FullCube_pieceAt(obj, idx){
  var ret;
  idx < 6?(ret = ~~obj.ul >> (5 - idx << 2)):idx < 12?(ret = ~~obj.ur >> (11 - idx << 2)):idx < 18?(ret = ~~obj.dl >> (17 - idx << 2)):(ret = ~~obj.dr >> (23 - idx << 2));
  return ~~((ret & 15) << 24) >> 24;
}

function FullCube_setPiece(obj, idx, value) {
  if (idx < 6) {
		obj.ul &= ~(0xf << ((5-idx) << 2));
		obj.ul |= value << ((5-idx) << 2);
	} else if (idx < 12) {
		obj.ur &= ~(0xf << ((11-idx) << 2));
		obj.ur |= value << ((11-idx) << 2);
	} else if (idx < 18) {
		obj.dl &= ~(0xf << ((17-idx) << 2));
		obj.dl |= value << ((17-idx) << 2);
	} else {
		obj.dr &= ~(0xf << ((23-idx) << 2));
		obj.dr |= value << ((23-idx) << 2);
	}	
}


function FullCube_FullCube__Ljava_lang_String_2V(){
  this.arr = []; 
  this.prm = []; 
}

function FullCube_randomCube(){
	var f, i, shape, edge, corner, n_edge, n_corner, rnd, m;
	f = new FullCube_FullCube__Ljava_lang_String_2V;
	shape = Shape_ShapeIdx[~~(square1SolverRandomSource.random() * 3678)];
	corner = 0x01234567 << 1 | 0x11111111;
	edge = 0x01234567 << 1;
	n_corner = n_edge = 8;
	for (i=0; i<24; i++) {
		if (((shape >> i) & 1) == 0) {//edge
			rnd = ~~(square1SolverRandomSource.random() * n_edge) << 2;
			FullCube_setPiece(f, 23-i, (edge >> rnd) & 0xf);
			m = (1 << rnd) - 1;
			edge = (edge & m) + ((edge >> 4) & ~m);
			--n_edge;
		} else {//corner
			rnd = ~~(square1SolverRandomSource.random() * n_corner) << 2;
			FullCube_setPiece(f, 23-i, (corner >> rnd) & 0xf);
			FullCube_setPiece(f, 22-i, (corner >> rnd) & 0xf);
			m = (1 << rnd) - 1;
			corner = (corner & m) + ((corner >> 4) & ~m);
			--n_corner;
			++i;								
		}
	}
	f.ml = ~~(square1SolverRandomSource.random() * 2);
//	console.log(f);
	return f;
}


function FullCube(){
}

_ = FullCube_FullCube__Ljava_lang_String_2V.prototype = FullCube.prototype; 
_.dl = 10062778;
_.dr = 14536702;
_.ml = 0;
_.ul = 70195;
_.ur = 4544119;
var FullCube_gen;
function Search_init2(obj){
  var corner, edge, i, j, ml, prun;
  FullCube_copy(obj.Search_d, obj.Search_c);
  for (i = 0; i < obj.Search_length1; ++i) {
    FullCube_doMove(obj.Search_d, obj.Search_move[i]);
  }
  FullCube_getSquare(obj.Search_d, obj.Search_sq);
  edge = obj.Search_sq.edgeperm;
  corner = obj.Search_sq.cornperm;
  ml = obj.Search_sq.ml;
  prun = Math.max( SquarePrun[obj.Search_sq.edgeperm << 1 | ml], SquarePrun[obj.Search_sq.cornperm << 1 | ml]);
  for (i = prun; i < obj.Search_maxlen2; ++i) {
    if (Search_phase2(obj, edge, corner, obj.Search_sq.topEdgeFirst, obj.Search_sq.botEdgeFirst, ml, i, obj.Search_length1, 0)) {
      for (j = 0; j < i; ++j) {
        FullCube_doMove(obj.Search_d, obj.Search_move[obj.Search_length1 + j]);
        //console.log(obj.Search_move[obj.Search_length1 + j]);
      }
      //console.log(obj.Search_d);
      //console.log(obj.Search_move);
      obj.Search_sol_string = Search_move2string(obj, i + obj.Search_length1);
      return true;
    }
  }
  return false;
}

function Search_move2string(obj, len) {
  var s = "";
  var top = 0, bottom = 0;
  for (var i=len-1; i>=0; i--) {
    var val = obj.Search_move[i];
    //console.log(val);
    if (val > 0) {
      val = 12 - val;
      top = (val > 6) ? (val-12) : val;
    } else if (val < 0) {
      val = 12 + val
      bottom = (val > 6) ? (val-12) : val;
    } else {
      if (top == 0 && bottom == 0) {
        s += " / "
      } else {
        s += "(" + top + ", " + bottom + ") / ";
      }
      top = bottom = 0;
    }
  }
  if (top == 0 && bottom == 0) {
  } else {
    s += "(" + top + ", " + bottom + ")";
  }
  return s;// + " (" + len + "t)";
}

function Search_phase1(obj, shape, prunvalue, maxl, depth, lm){
  var m, prunx, shapex;
  if (prunvalue == 0 && maxl < 4) {
    return maxl == 0 && Search_init2(obj);
  }
  if (lm != 0) {
    shapex =  Shape_TwistMove[shape];
    prunx = ShapePrun[shapex];
    if (prunx < maxl) {
      obj.Search_move[depth] = 0;
      if (Search_phase1(obj, shapex, prunx, maxl - 1, depth + 1, 0)) {
        return true;
      }
    }
  }
  shapex = shape;
  if (lm <= 0) {
    m = 0;
    while (true) {
      m +=  Shape_TopMove[shapex];
      shapex = ~~m >> 4;
      m &= 15;
      if (m >= 12) {
        break;
      }
      prunx = ShapePrun[shapex];
      if (prunx > maxl) {
        break;
      }
       else if (prunx < maxl) {
        obj.Search_move[depth] = m;
        if (Search_phase1(obj, shapex, prunx, maxl - 1, depth + 1, 1)) {
          return true;
        }
      }
    }
  }
  shapex = shape;
  if (lm <= 1) {
    m = 0;
    while (true) {
      m +=  Shape_BottomMove[shapex];
      shapex = ~~m >> 4;
      m &= 15;
      if (m >= 6) {
        break;
      }
      prunx = ShapePrun[shapex];
      if (prunx > maxl) {
        break;
      }
       else if (prunx < maxl) {
        obj.Search_move[depth] = -m;
        if (Search_phase1(obj, shapex, prunx, maxl - 1, depth + 1, 2)) {
          return true;
        }
      }
    }
  }
  return false;
}

function Search_phase2(obj, edge, corner, topEdgeFirst, botEdgeFirst, ml, maxl, depth, lm){
  var botEdgeFirstx, cornerx, edgex, m, prun1, prun2, topEdgeFirstx;
  if (maxl == 0 && !topEdgeFirst && botEdgeFirst) {
    return true;
  }
  if (lm != 0 && topEdgeFirst == botEdgeFirst) {
    edgex =  Square_TwistMove[edge];
    cornerx = Square_TwistMove[corner];
    if (SquarePrun[edgex << 1 | 1 - ml] < maxl && SquarePrun[cornerx << 1 | 1 - ml] < maxl) {
      obj.Search_move[depth] = 0;
      if (Search_phase2(obj, edgex, cornerx, topEdgeFirst, botEdgeFirst, 1 - ml, maxl - 1, depth + 1, 0)) {
        return true;
      }
    }
  }
  if (lm <= 0) {
    topEdgeFirstx = !topEdgeFirst;
    edgex = topEdgeFirstx? Square_TopMove[edge]:edge;
    cornerx = topEdgeFirstx?corner: Square_TopMove[corner];
    m = topEdgeFirstx?1:2;
    prun1 =  SquarePrun[edgex << 1 | ml];
    prun2 = SquarePrun[cornerx << 1 | ml];
    while (m < 12 && prun1 <= maxl && prun1 <= maxl) {
      if (prun1 < maxl && prun2 < maxl) {
        obj.Search_move[depth] = m;
        if (Search_phase2(obj, edgex, cornerx, topEdgeFirstx, botEdgeFirst, ml, maxl - 1, depth + 1, 1)) {
          return true;
        }
      }
      topEdgeFirstx = !topEdgeFirstx;
      if (topEdgeFirstx) {
        edgex = Square_TopMove[edgex];
        prun1 = SquarePrun[edgex << 1 | ml];
        m += 1;
      }
       else {
        cornerx = Square_TopMove[cornerx];
        prun2 = SquarePrun[cornerx << 1 | ml];
        m += 2;
      }
    }
  }
  if (lm <= 1) {
    botEdgeFirstx = !botEdgeFirst;
    edgex = botEdgeFirstx? Square_BottomMove[edge]:edge;
    cornerx = botEdgeFirstx?corner: Square_BottomMove[corner];
    m = botEdgeFirstx?1:2;
    prun1 =  SquarePrun[edgex << 1 | ml];
    prun2 = SquarePrun[cornerx << 1 | ml];
    while (m < (maxl > 3?6:12) && prun1 <= maxl && prun1 <= maxl) {
      if (prun1 < maxl && prun2 < maxl) {
        obj.Search_move[depth] = -m;
        if (Search_phase2(obj, edgex, cornerx, topEdgeFirst, botEdgeFirstx, ml, maxl - 1, depth + 1, 2)) {
          return true;
        }
      }
      botEdgeFirstx = !botEdgeFirstx;
      if (botEdgeFirstx) {
        edgex = Square_BottomMove[edgex];
        prun1 = SquarePrun[edgex << 1 | ml];
        m += 1;
      }
       else {
        cornerx = Square_BottomMove[cornerx];
        prun2 = SquarePrun[cornerx << 1 | ml];
        m += 2;
      }
    }
  }
  return false;
}

function Search_solution(obj, c){
  var shape;
  obj.Search_c = c;
  shape = FullCube_getShapeIdx(c);
  //console.log(shape);
  for (obj.Search_length1 =  ShapePrun[shape]; obj.Search_length1 < 100; ++obj.Search_length1) {
    //console.log(obj.Search_length1);
    obj.Search_maxlen2 = Math.min(31 - obj.Search_length1, 17);
    if (Search_phase1(obj, shape, ShapePrun[shape], obj.Search_length1, 0, -1)) {
      break;
    }
  }
  return obj.Search_sol_string;
}

function Search_Search(){
  this.Search_move = []; 
  this.Search_d = new FullCube_FullCube__Ljava_lang_String_2V;
  this.Search_sq = new Square_Square;
}

function Search(){
}

_ = Search_Search.prototype = Search.prototype; 
_.Search_c = null;
_.Search_length1 = 0;
_.Search_maxlen2 = 0;
_.Search_sol_string = null;
function Shape_$clinit(){
  Shape_$clinit = nullMethod;
  Shape_halflayer =[0, 3, 6, 12, 15, 24, 27, 30, 48, 51, 54, 60, 63]; 
  Shape_ShapeIdx = []; 
  ShapePrun = []; 
  Shape_TopMove = []; 
  Shape_BottomMove = []; 
  Shape_TwistMove = []; 
  Shape_init();
}

function Shape_bottomMove(obj){
  var move, moveParity;
  move = 0;
  moveParity = 0;
  do {
    if ((obj.bottom & 2048) == 0) {
      move += 1;
      obj.bottom = obj.bottom << 1;
    }
     else {
      move += 2;
      obj.bottom = obj.bottom << 2 ^ 12291;
    }
    moveParity = 1 - moveParity;
  }
   while ((bitCount(obj.bottom & 63) & 1) != 0);
  (bitCount(obj.bottom) & 2) == 0 && (obj.Shape_parity ^= moveParity);
  return move;
}

function Shape_getIdx(obj){
  var ret;
  ret = binarySearch(Shape_ShapeIdx, obj.top << 12 | obj.bottom) << 1 | obj.Shape_parity;
  return ret;
}

function Shape_setIdx(obj, idx){
  obj.Shape_parity = idx & 1;
  obj.top = Shape_ShapeIdx[~~idx >> 1];
  obj.bottom = obj.top & 4095;
  obj.top >>= 12;
}

function Shape_topMove(obj){
  var move, moveParity;
  move = 0;
  moveParity = 0;
  do {
    if ((obj.top & 2048) == 0) {
      move += 1;
      obj.top = obj.top << 1;
    }
     else {
      move += 2;
      obj.top = obj.top << 2 ^ 12291;
    }
    moveParity = 1 - moveParity;
  }
   while ((bitCount(obj.top & 63) & 1) != 0);
  (bitCount(obj.top) & 2) == 0 && (obj.Shape_parity ^= moveParity);
  return move;
}

function Shape_Shape(){
}

function Shape_getShape2Idx(shp){
  var ret;
  ret = binarySearch(Shape_ShapeIdx, shp & 16777215) << 1 | ~~shp >> 24;
  return ret;
}

function Shape_init(){
  var count, depth, dl, done, done0, dr, i, idx, m, s, ul, ur, value, p1, p3, temp;
  count = 0;
  for (i = 0; i < 28561; ++i) {
    dr = Shape_halflayer[i % 13];
    dl = Shape_halflayer[~~(i / 13) % 13];
    ur = Shape_halflayer[~~(~~(i / 13) / 13) % 13];
    ul = Shape_halflayer[~~(~~(~~(i / 13) / 13) / 13)];
    value = ul << 18 | ur << 12 | dl << 6 | dr;
    bitCount(value) == 16 && (Shape_ShapeIdx[count++] = value);
  }
  s = new Shape_Shape;
  for (i = 0; i < 7356; ++i) {
    Shape_setIdx(s, i);
    Shape_TopMove[i] = Shape_topMove(s);
    Shape_TopMove[i] |= Shape_getIdx(s) << 4;
    Shape_setIdx(s, i);
    Shape_BottomMove[i] = Shape_bottomMove(s);
    Shape_BottomMove[i] |= Shape_getIdx(s) << 4;
    Shape_setIdx(s, i);
    temp = s.top & 63;
    p1 = bitCount(temp);
    p3 = bitCount(s.bottom & 4032);
    s.Shape_parity ^= 1 & ~~(p1 & p3) >> 1;
    s.top = s.top & 4032 | ~~s.bottom >> 6 & 63;
    s.bottom = s.bottom & 63 | temp << 6;
    Shape_TwistMove[i] = Shape_getIdx(s);
  }
  for (i = 0; i < 7536; ++i) {
    ShapePrun[i] = -1;
  }
  ShapePrun[Shape_getShape2Idx(14378715)] = 0;
  ShapePrun[Shape_getShape2Idx(31157686)] = 0;
  ShapePrun[Shape_getShape2Idx(23967451)] = 0;
  ShapePrun[Shape_getShape2Idx(7191990)] = 0;
  done = 4;
  done0 = 0;
  depth = -1;
  while (done != done0) {
    done0 = done;
    ++depth;
    for (i = 0; i < 7536; ++i) {
      if (ShapePrun[i] == depth) {
        m = 0;
        idx = i;
        do {
          idx = Shape_TopMove[idx];
          m += idx & 15;
          idx >>= 4;
          if (ShapePrun[idx] == -1) {
            ++done;
            ShapePrun[idx] = depth + 1;
          }
        }
         while (m != 12);
        m = 0;
        idx = i;
        do {
          idx = Shape_BottomMove[idx];
          m += idx & 15;
          idx >>= 4;
          if (ShapePrun[idx] == -1) {
            ++done;
            ShapePrun[idx] = depth + 1;
          }
        }
         while (m != 12);
        idx = Shape_TwistMove[i];
        if (ShapePrun[idx] == -1) {
          ++done;
          ShapePrun[idx] = depth + 1;
        }
      }
    }
  }
}

function Shape(){
}

_ = Shape_Shape.prototype = Shape.prototype; 
_.bottom = 0;
_.Shape_parity = 0;
_.top = 0;
var Shape_BottomMove, Shape_ShapeIdx, ShapePrun, Shape_TopMove, Shape_TwistMove, Shape_halflayer;
function Square_$clinit(){
  Square_$clinit = nullMethod;
  SquarePrun = []; 
  Square_TwistMove = []; 
  Square_TopMove = []; 
  Square_BottomMove = []; 
  fact = [1, 1, 2, 6, 24, 120, 720, 5040]; 
  Cnk = []; 
  for (var i=0; i<12; ++i) Cnk[i] = [];
  Square_init();
}

function Square_Square(){
}

function get8Perm(arr){
  var i, idx, v, val;
  idx = 0;
  val = 1985229328;
  for (i = 0; i < 7; ++i) {
    v = arr[i] << 2;
    idx = (8 - i) * idx + (~~val >> v & 7);
    val -= 286331152 << v;
  }
  return idx & 65535;
}

function Square_init(){
  var check, depth, done, find, i, idx, idxx, inv, j, m, ml, pos, temp;
  for (i = 0; i < 12; ++i) {
    Cnk[i][0] = 1;
    Cnk[i][i] = 1;
    for (j = 1; j < i; ++j) {
      Cnk[i][j] = Cnk[i - 1][j - 1] + Cnk[i - 1][j];
    }
  }
  pos = []; 
  for (i = 0; i < 40320; ++i) {
    set8Perm(pos, i);
    temp = pos[2];
    pos[2] = pos[4];
    pos[4] = temp;
    temp = pos[3];
    pos[3] = pos[5];
    pos[5] = temp;
    Square_TwistMove[i] = get8Perm(pos);
    set8Perm(pos, i);
    temp = pos[0];
    pos[0] = pos[1];
    pos[1] = pos[2];
    pos[2] = pos[3];
    pos[3] = temp;
    Square_TopMove[i] = get8Perm(pos);
    set8Perm(pos, i);
    temp = pos[4];
    pos[4] = pos[5];
    pos[5] = pos[6];
    pos[6] = pos[7];
    pos[7] = temp;
    Square_BottomMove[i] = get8Perm(pos);
  }
  for (i = 0; i < 80640; ++i) {
    SquarePrun[i] = -1;
  }
  SquarePrun[0] = 0;
  depth = 0;
  done = 1;
  while (done < 80640) {
    // console.log(done);
    inv = depth >= 11;
    find = inv?-1:depth;
    check = inv?depth:-1;
    ++depth;
    OUT: for (i = 0; i < 80640; ++i) {
      if (SquarePrun[i] == find) {
        idx = ~~i >> 1;
        ml = i & 1;
        idxx = Square_TwistMove[idx] << 1 | 1 - ml;
        if (SquarePrun[idxx] == check) {
          ++done;
          SquarePrun[inv?i:idxx] = ~~(depth << 24) >> 24;
          if (inv)
            continue OUT;
        }
        idxx = idx;
        for (m = 0; m < 4; ++m) {
          idxx = Square_TopMove[idxx];
          if (SquarePrun[idxx << 1 | ml] == check) {
            ++done;
            SquarePrun[inv?i:idxx << 1 | ml] = ~~(depth << 24) >> 24;
            if (inv)
              continue OUT;
          }
        }
        for (m = 0; m < 4; ++m) {
          idxx = Square_BottomMove[idxx];
          if (SquarePrun[idxx << 1 | ml] == check) {
            ++done;
            SquarePrun[inv?i:idxx << 1 | ml] = ~~(depth << 24) >> 24;
            if (inv)
              continue OUT;
          }
        }
      }
    }
  }
}

function set8Perm(arr, idx){
  var i, m, p, v, val;
  val = 1985229328;
  for (i = 0; i < 7; ++i) {
    p = fact[7 - i];
    v = ~~(idx / p);
    idx -= v * p;
    v <<= 2;
    arr[i] = ~~((~~val >> v & 7) << 24) >> 24;
    m = (1 << v) - 1;
    val = (val & m) + (~~val >> 4 & ~m);
  }
  arr[7] = ~~(val << 24) >> 24;
}

function Square(){
}

_ = Square_Square.prototype = Square.prototype; 
_.botEdgeFirst = false;
_.cornperm = 0;
_.edgeperm = 0;
_.ml = 0;
_.topEdgeFirst = false;
var Square_BottomMove, Cnk, SquarePrun, Square_TopMove, Square_TwistMove, fact;

function bitCount(x){
  x -= ~~x >> 1 & 1431655765;
  x = (~~x >> 2 & 858993459) + (x & 858993459);
  x = (~~x >> 4) + x & 252645135;
  x += ~~x >> 8;
  x += ~~x >> 16;
  return x & 63;
}

function binarySearch(sortedArray, key){
  var high, low, mid, midVal;
  low = 0;
  high = sortedArray.length - 1;
  while (low <= high) {
    mid = low + (~~(high - low) >> 1);
    midVal = sortedArray[mid];
    if (midVal < key) {
      low = mid + 1;
    }
     else if (midVal > key) {
      high = mid - 1;
    }
     else {
      return mid;
    }
  }
  return -low - 1;
}

  /*
   * Some helper functions.
   */

  var square1Solver_initialized = false;

  var square1SolverInitialize= function(doneCallback, iniRandomSource, statusCallback) {

    setRandomSource(iniRandomSource);
    
    if (!square1Solver_initialized) {
      Shape_$clinit();
      Square_$clinit();
    }

    if (statusCallback) {
      statusCallback("Done initializing Square-1.");
    }

    square1Solver_initialized = true;
    if (doneCallback != null) {
      doneCallback();
    }
  }

  var square1SolverRandomSource = undefined;

  // If we have a better (P)RNG:
  var setRandomSource = function(src) {
    square1SolverRandomSource = src;
  }

  var square1SolverGetRandomPosition = function() {
    if (!square1Solver_initialized) {
      square1SolverInitialize();
    }
    return FullCube_randomCube();
  }

  var square1SolverGenerate = function(state) {
    var search_search = new Search_Search; // Can this be factored out?
    return Search_solution(search_search, state);
  }

  var square1SolverGetRandomScramble = function() {
    var randomState = square1SolverGetRandomPosition();
    var scrambleString = square1SolverGenerate(randomState);

    return {
      state: randomState,
      scramble_string: scrambleString 
    };
  }

  /*
   * Drawing methods. These are extremely messy and outdated by now, but at least they work.
   */


  function colorGet(col){
    if (col==="r") return ("#FF0000");
    if (col==="o") return ("#FF8000");
    if (col==="b") return ("#0000FF");
    if (col==="g") return ("#00FF00");
    if (col==="y") return ("#FFFF00");
    if (col==="w") return ("#FFFFFF");
    if (col==="x") return ("#000000");
  }

var scalePoint = function(w, h, ptIn) {
  
  var defaultWidth = 200;
  var defaultHeight = 110;

  var scale = Math.min(w/defaultWidth, h/defaultHeight);

  var x = ptIn[0]*scale + (w - (defaultWidth * scale))/2;
  var y = ptIn[1]*scale + (h - (defaultHeight * scale))/2;

  return [x, y];
}

function drawPolygon(r, fillColor, w, h, arrx, arry) {

  var pathString = "";
  for (var i = 0; i < arrx.length; i++) {
    var scaledPoint = scalePoint(w, h, [arrx[i], arry[i]]);
    pathString += ((i===0) ? "M" : "L") + scaledPoint[0] + "," + scaledPoint[1];
  }
  pathString += "z";

  r.path(pathString).attr({fill: colorGet(fillColor), stroke: "#000"})
}
 
 
function drawSq(stickers, middleIsSolved, shapes, parentElement, width, height, colorString) {

    var z = 1.366 // sqrt(2) / sqrt(1^2 + tan(15 degrees)^2)
    var r = Raphael(parentElement, width, height);

    var arrx, arry;
   
    var margin = 1;
    var sidewid=.15*100/z;
    var cx = 50;
    var cy = 50;
    var radius=(cx-margin-sidewid*z)/z;
    var w = (sidewid+radius)/radius   // ratio btw total piece width and radius
   
    var angles=[0,0,0,0,0,0,0,0,0,0,0,0,0];
    var angles2=[0,0,0,0,0,0,0,0,0,0,0,0,0];
   
    //initialize angles
    for(var foo=0; foo<24; foo++){
      angles[foo]=(17-foo*2)/12*Math.PI;
      shapes = shapes.concat("xxxxxxxxxxxxxxxx");
    }
    for(var foo=0; foo<24; foo++){
      angles2[foo]=(19-foo*2)/12*Math.PI;
      shapes = shapes.concat("xxxxxxxxxxxxxxxx");
    }
    
    function cos1(index) {return Math.cos(angles[index])*radius;}
    function sin1(index) {return Math.sin(angles[index])*radius;}
    function cos2(index) {return Math.cos(angles2[index])*radius;}
    function sin2(index) {return Math.sin(angles2[index])*radius;}

    var h = sin1(1)*w*z - sin1(1)*z;
    if (middleIsSolved) {
      arrx=[cx+cos1(1)*w*z, cx+cos1(4)*w*z, cx+cos1(7)*w*z, cx+cos1(10)*w*z];
      arry=[cy-sin1(1)*w*z, cy-sin1(4)*w*z, cy-sin1(7)*w*z, cy-sin1(10)*w*z];
      drawPolygon(r, "x", width, height, arrx, arry);
      
      cy += 10;
      arrx=[cx+cos1(0)*w, cx+cos1(0)*w, cx+cos1(1)*w*z, cx+cos1(1)*w*z];
      arry=[cy-sin1(1)*w*z, cy-sin1(1)*z, cy-sin1(1)*z, cy-sin1(1)*w*z, cy-sin1(1)*w*z];
      drawPolygon(r, colorString[5], width, height, arrx, arry)

      arrx=[cx+cos1(0)*w, cx+cos1(0)*w, cx+cos1(10)*w*z, cx+cos1(10)*w*z];
      arry=[cy-sin1(1)*w*z, cy-sin1(1)*z, cy-sin1(1)*z, cy-sin1(1)*w*z, cy-sin1(1)*w*z];
      drawPolygon(r, colorString[5], width, height, arrx, arry)
      cy -= 10;
    }
    else {
      arrx=[cx+cos1(1)*w*z, cx+cos1(4)*w*z, cx+cos1(6)*w, cx+cos1(9)*w*z, cx+cos1(11)*w*z, cx+cos1(0)*w];
      arry=[cy-sin1(1)*w*z, cy-sin1(4)*w*z, cy-sin1(6)*w, cy+sin1(9)*w*z, cy-sin1(11)*w*z, cy-sin1(0)*w];
      drawPolygon(r, "x", width, height, arrx, arry);

      arrx=[cx+cos1(9)*w*z, cx+cos1(11)*w*z, cx+cos1(11)*w*z, cx+cos1(9)*w*z];
      arry=[cy+sin1(9)*w*z-h, cy-sin1(11)*w*z-h, cy-sin1(11)*w*z, cy+sin1(9)*w*z];
      drawPolygon(r, colorString[4], width, height, arrx, arry);

      cy += 10;
      arrx=[cx+cos1(0)*w, cx+cos1(0)*w, cx+cos1(1)*w*z, cx+cos1(1)*w*z];
      arry=[cy-sin1(1)*w*z, cy-sin1(1)*z, cy-sin1(1)*z, cy-sin1(1)*w*z];
      drawPolygon(r, colorString[5], width, height, arrx, arry)

      arrx=[cx+cos1(0)*w, cx+cos1(0)*w, cx+cos1(11)*w*z, cx+cos1(11)*w*z];
      arry=[cy-sin1(1)*w*z, cy-sin1(1)*z, cy-sin1(11)*w*z + h, cy-sin1(11)*w*z];
      drawPolygon(r, colorString[2], width, height, arrx, arry)
      cy -= 10;
    }
     
    //fill and outline first layer
    var sc = 0;
    for(var foo=0; sc<12; foo++){
      if (shapes.length<=foo) sc = 12;
      if (shapes.charAt(foo)==="x") sc++;
      if (shapes.charAt(foo)==="c"){
        arrx=[cx, cx+cos1(sc), cx+cos1(sc+1)*z, cx+cos1(sc+2)];
        arry=[cy, cy-sin1(sc), cy-sin1(sc+1)*z, cy-sin1(sc+2)];
        drawPolygon(r, stickers.charAt(foo), width, height, arrx, arry)
    
        arrx=[cx+cos1(sc), cx+cos1(sc+1)*z, cx+cos1(sc+1)*w*z, cx+cos1(sc)*w];
        arry=[cy-sin1(sc), cy-sin1(sc+1)*z, cy-sin1(sc+1)*w*z, cy-sin1(sc)*w];
        drawPolygon(r, stickers.charAt(16+sc), width, height, arrx, arry)
      
        arrx=[cx+cos1(sc+2), cx+cos1(sc+1)*z, cx+cos1(sc+1)*w*z, cx+cos1(sc+2)*w];
        arry=[cy-sin1(sc+2), cy-sin1(sc+1)*z, cy-sin1(sc+1)*w*z, cy-sin1(sc+2)*w];
        drawPolygon(r, stickers.charAt(17+sc), width, height, arrx, arry)
   
        sc +=2;
      }
      if (shapes.charAt(foo)==="e"){
        arrx=[cx, cx+cos1(sc), cx+cos1(sc+1)];
        arry=[cy, cy-sin1(sc), cy-sin1(sc+1)];
        drawPolygon(r, stickers.charAt(foo), width, height, arrx, arry)
    
        arrx=[cx+cos1(sc), cx+cos1(sc+1), cx+cos1(sc+1)*w, cx+cos1(sc)*w];
        arry=[cy-sin1(sc), cy-sin1(sc+1), cy-sin1(sc+1)*w, cy-sin1(sc)*w];
        drawPolygon(r, stickers.charAt(16+sc), width, height, arrx, arry)
    
        sc +=1;
      }
    }
   
    //fill and outline second layer
    cx += 100;  
    cy += 10;


    var h = sin1(1)*w*z - sin1(1)*z;
    if (middleIsSolved) {
      arrx=[cx+cos1(1)*w*z, cx+cos1(4)*w*z, cx+cos1(7)*w*z, cx+cos1(10)*w*z];
      arry=[cy+sin1(1)*w*z, cy+sin1(4)*w*z, cy+sin1(7)*w*z, cy+sin1(10)*w*z];
      drawPolygon(r, "x", width, height, arrx, arry);
      
      cy -= 10;
      arrx=[cx+cos1(0)*w, cx+cos1(0)*w, cx+cos1(1)*w*z, cx+cos1(1)*w*z];
      arry=[cy+sin1(1)*w*z, cy+sin1(1)*z, cy+sin1(1)*z, cy+sin1(1)*w*z, cy+sin1(1)*w*z];
      drawPolygon(r, colorString[5], width, height, arrx, arry)

      arrx=[cx+cos1(0)*w, cx+cos1(0)*w, cx+cos1(10)*w*z, cx+cos1(10)*w*z];
      arry=[cy+sin1(1)*w*z, cy+sin1(1)*z, cy+sin1(1)*z, cy+sin1(1)*w*z, cy+sin1(1)*w*z];
      drawPolygon(r, colorString[5], width, height, arrx, arry)
      cy += 10;
    }
    else {
      arrx=[cx+cos1(1)*w*z, cx+cos1(4)*w*z, cx+cos1(6)*w, cx+cos1(9)*w*z, cx+cos1(11)*w*z, cx+cos1(0)*w];
      arry=[cy+sin1(1)*w*z, cy+sin1(4)*w*z, cy+sin1(6)*w, cy-sin1(9)*w*z, cy+sin1(11)*w*z, cy+sin1(0)*w];
      drawPolygon(r, "x", width, height, arrx, arry);

      arrx=[cx+cos1(9)*w*z, cx+cos1(11)*w*z, cx+cos1(11)*w*z, cx+cos1(9)*w*z];
      arry=[cy-sin1(9)*w*z+h, cy+sin1(11)*w*z+h, cy+sin1(11)*w*z, cy-sin1(9)*w*z];
      drawPolygon(r, colorString[4], width, height, arrx, arry);

      cy -= 10;
      arrx=[cx+cos1(0)*w, cx+cos1(0)*w, cx+cos1(1)*w*z, cx+cos1(1)*w*z];
      arry=[cy+sin1(1)*w*z, cy+sin1(1)*z, cy+sin1(1)*z, cy+sin1(1)*w*z];
      drawPolygon(r, colorString[5], width, height, arrx, arry)

      arrx=[cx+cos1(0)*w, cx+cos1(0)*w, cx+cos1(11)*w*z, cx+cos1(11)*w*z];
      arry=[cy+sin1(1)*w*z, cy+sin1(1)*z, cy+sin1(11)*w*z - h, cy+sin1(11)*w*z];
      drawPolygon(r, colorString[2], width, height, arrx, arry)
      cy += 10;
    }

    var sc = 0;
    for(sc=0; sc<12; foo++){
      if (shapes.length<=foo) sc = 12;
      if (shapes.charAt(foo)==="x") sc++;
      if (shapes.charAt(foo)==="c"){
        arrx=[cx, cx+cos2(sc), cx+cos2(sc+1)*z, cx+cos2(sc+2)];
        arry=[cy, cy-sin2(sc), cy-sin2(sc+1)*z, cy-sin2(sc+2)];
        drawPolygon(r, stickers.charAt(foo), width, height, arrx, arry)
   
        arrx=[cx+cos2(sc), cx+cos2(sc+1)*z, cx+cos2(sc+1)*w*z, cx+cos2(sc)*w];
        arry=[cy-sin2(sc), cy-sin2(sc+1)*z, cy-sin2(sc+1)*w*z, cy-sin2(sc)*w];
        drawPolygon(r, stickers.charAt(28+sc), width, height, arrx, arry)
    
        arrx=[cx+cos2(sc+2), cx+cos2(sc+1)*z, cx+cos2(sc+1)*w*z, cx+cos2(sc+2)*w];
        arry=[cy-sin2(sc+2), cy-sin2(sc+1)*z, cy-sin2(sc+1)*w*z, cy-sin2(sc+2)*w];
        drawPolygon(r, stickers.charAt(29+sc), width, height, arrx, arry)

        sc +=2;
   
      }
      if (shapes.charAt(foo)==="e"){
        arrx=[cx, cx+cos2(sc), cx+cos2(sc+1)];
        arry=[cy, cy-sin2(sc), cy-sin2(sc+1)];
        drawPolygon(r, stickers.charAt(foo), width, height, arrx, arry)
    
        arrx=[cx+cos2(sc), cx+cos2(sc+1), cx+cos2(sc+1)*w, cx+cos2(sc)*w];
        arry=[cy-sin2(sc), cy-sin2(sc+1), cy-sin2(sc+1)*w, cy-sin2(sc)*w];
        drawPolygon(r, stickers.charAt(28+sc), width, height, arrx, arry)
   
        sc +=1;
      }
    }

  }

  var remove_duplicates = function(arr) {
    var out = [];
    var j=0;
    for (var i=0; i<arr.length; i++)
    {
      if(i===0 || arr[i]!=arr[i-1])
      out[j++] = arr[i];
    }
    return out;
  }

  var drawScramble = function(parentElement, sq1State, w, h) {
//	console.log(sq1State);
    var state = sq1State["arr"];

    var colorString = "yobwrg";  //In dlburf order.
      
    var posit;
    var scrambleString;
    var tb, ty, col, eido;

    var middleIsSolved = sq1State.ml == 0;

    var posit = [];
    
    var map = [5,4,3,2,1,0,11,10,9,8,7,6,17,16,15,14,13,12,23,22,21,20,19,18];
//    FullCube_doMove(sq1State, 1);
//    FullCube_doMove(sq1State, 0);
    for (var j = 0; j < map.length; j++) {
      posit.push(FullCube_pieceAt(sq1State, map[j]));
    }
//    console.log(posit);
        
    var tb = ["3","3","3","3","3","3","3","3","0","0","0","0","0","0","0","0"];
    ty = ["e","c","e","c","e","c","e","c","e","c","e","c","e","c","e","c"];
    col = ["2","12","1","51","5","45","4","24", "4","42","5","54","1","15","2","21"];
 
    var top_side=remove_duplicates(posit.slice(0,12));
    var bot_side=remove_duplicates(posit.slice(18,24).concat(posit.slice(12,18)));
    var eido=top_side.concat(bot_side);

    var a="";
    var b="";
    var c="";
    var eq="_";
    for(var j=0; j<16; j++)
    {
      a+=ty[eido[j]];
      eq=eido[j];
      b+=tb[eido[j]];
      c+=col[eido[j]];
    }
    
    var stickers = (b.concat(c)
      .replace(/0/g,colorString[0])
      .replace(/1/g,colorString[1])
      .replace(/2/g,colorString[2])
      .replace(/3/g,colorString[3])
      .replace(/4/g,colorString[4])
      .replace(/5/g,colorString[5])
    );
    drawSq(stickers, middleIsSolved, a, parentElement, w, h, colorString);

  }

  /*
   * Export public methods.
   */

  return {

    /* mark2 interface */
    version: "May 17, 2012",
    initialize: square1SolverInitialize,
    setRandomSource: setRandomSource,
    getRandomScramble: square1SolverGetRandomScramble,
    drawScramble: drawScramble,

    /* Other methods */
    getRandomPosition: square1SolverGetRandomPosition,
    //solve: square1SolverSolve,
    generate: square1SolverGenerate,
  };

})();

module.exports = scrambler;
},{}],6:[function(_dereq_,module,exports){
var scramblers = {}
scramblers = _dereq_('./scramblers/NNN.js');
// scramblers['222'] = require('./scramblers/222.js');
// scramblers['333'] = require('./scramblers/333.js');
scramblers['clock'] = _dereq_('./scramblers/clock.js');
scramblers['minx'] = _dereq_('./scramblers/minx.js');
scramblers['pyram'] = _dereq_('./scramblers/pyram.js');
scramblers['sq1'] = _dereq_('./scramblers/sq1.js');

/**
 * A scramble generator
 * @constructor
 * @param {string} t scramble type
 */
var Scrambo = function(t) {
	this.t = t || '333';
	this.s = {};
	this.setRandomSource(Math);
	this.type(this.t);
	return this;
};

/**
 * Gets/Sets scramble type
 * @param {string} type scramble type
 * @returns {string} set type
 */
Scrambo.prototype.type = function(type) {
	if (!arguments.length) return this.t;

	// Check the scrambler exists.
	if(!scramblers.hasOwnProperty(this.t)){
		throw new Error('Invalid scrambler, allowed: ' + Object.keys(scramblers));
		return;
	}

	this.t = type;

	scramblers[this.t].initialize(null, this.s);

	return this;
};

/**
 * Return a scramble
 * @param {number} num number of scrambles
 * @returns {string} generated scramble
 */
Scrambo.prototype.get = function(num) {
	var stack = '';
	if (!arguments.length) return scramblers[this.t].getRandomScramble().scramble_string;
	for(i = 0; i < num; i++) {
		stack += scramblers[this.t].getRandomScramble().scramble_string + "\n";
	}
	return stack;
};

/**
 * Sets the seed
 * @param {num|Math} random source
 */
Scrambo.prototype.seed = function(seed) {
	// http://stackoverflow.com/a/19303725
	this.setRandomSource({
		random: function() {
			var x = Math.sin(seed++) * 10000;
    		return x - Math.floor(x);
		}
	});

	scramblers[this.t].initialize(null, this.s);

	return this;
};

/**
 * Sets the random source
 * @param {src} random source
 */
Scrambo.prototype.setRandomSource = function(src) {
	this.s = src;
};

module.exports = Scrambo;
},{"./scramblers/NNN.js":1,"./scramblers/clock.js":2,"./scramblers/minx.js":3,"./scramblers/pyram.js":4,"./scramblers/sq1.js":5}]},{},[6])
(6)
});