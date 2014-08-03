var EE = require('events').EventEmitter;
var split = require('split');
var through = require('through');
var combine = require('stream-combiner');
var stringify = require('json-stringify-safe');

module.exports = JSONDuplexStream;

function JSONDuplexStream() {

  var self = new EE();


  // input

  var parse = through(function(chunk) {
    try {
      this.queue(JSON.parse(chunk));
    }
    catch (err) {
      this.emit('error', err);
    }
  });

  var input = combine(split(), parse);
  input.on('error', onError);
  self.in = input;


  // output

  var serialize = through(function(chunk) {
    this.queue(stringify(chunk) + '\n');
  });

  serialize.on('error', onError);
  self.out = serialize;

  return self;

  function onError(err) {
    if (self.listeners('error').length > 0) {
      self.emit('error', err);
    }
  }
}
