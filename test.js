var test = require('tape');
var through = require('through');

var JSONDuplexStream = require('./');
var json = JSON.stringify;

test('simple', function(assert) {
  assert.plan(1);

  var net = through();

  var app = through(function(d) {
    assert.deepEqual(d, {foo: 'bar'});
  });

  var s = JSONDuplexStream();
  net.pipe(s.in).pipe(app).pipe(s.out).pipe(net);

  net.emit('data', json({foo: 'bar'}) + '\n');
});

test('partial', function(assert) {
  assert.plan(1);

  var net = through();

  var app = through(function(d) {
    assert.deepEqual(d, {foo: 'bar'});
  });

  var s = JSONDuplexStream();

  net.pipe(s.in).pipe(app).pipe(s.out).pipe(net);

  net.emit('data', '{');
  net.emit('data', '"foo":');
  net.emit('data', '"bar"');
  net.emit('data', '}');
  net.emit('data', '\n');
});


test('multi', function(assert) {
  assert.plan(2);

  var net = through();

  var app = through(function(d) {
    assert.deepEqual(d, {foo: 'bar'});
  });

  var s = JSONDuplexStream();

  net.pipe(s.in).pipe(app).pipe(s.out).pipe(net);

  net.emit('data', '{"foo":"bar"}\n');
  net.emit('data', '{"foo":');
  net.emit('data', '"bar"}\n');
});

test('parse error', function(assert) {
  assert.plan(1);

  var net = through();

  var app = through(function(d) {
      assert.deepEqual(d, {foo: 'bar'});
  });

  var s = JSONDuplexStream();
  net.pipe(s.in).pipe(app).pipe(s.out).pipe(net);

  s.in.on('error', function(err) {
    assert.equal(err.message, 'Unexpected token f');
  });

  net.emit('data', '{foo:"bar}\n');
  net.emit('data', '{"foo":"bar"}\n');
});

// no more parsing after original stream emits error
test('net error', function(assert) {
  assert.plan(1);

  var net = through();
  var app = through(function() {
    assert.ok(false);
  });

  var s = JSONDuplexStream();

  net.pipe(s.in).pipe(app).pipe(s.out).pipe(net);

  net.on('error', function(err) {
    assert.equals(err.message, 'foobar');
  });

  net.emit('error', new Error('foobar'));
  net.emit('data', '{"foo":"bar"}\n');
});
