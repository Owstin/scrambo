//TODO use Mocha, Jasmine or sumin

var Assert = require('assert');
var Scramble = require('./scramble.js');

// Type should be set to 333
var test = new Scramble();
test.type('333');
Assert.equal(test.type(), '333', 'Type should be set to 333');