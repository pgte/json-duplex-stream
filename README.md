# json-duplex-stream

[![Build Status](https://travis-ci.org/pgte/json-duplex-stream.svg?branch=master)](https://travis-ci.org/pgte/json-duplex-stream)

Newline-separated JSON duplex stream

## Install

```bash
$ npm i json-duplex-stream --save
```

## Require

```javascript
var JSONDuplexStream = require('json-duplex-stream');
```

## Instantiate

```javascript
var stream = JSONDuplexStream();
```

## Pipe

Pipe input to `stream.in` and output from `stream.out`.

```javascript
var stream = JSONDuplexStream();
in.pipe(stream.in).pipe(app).pipe(stream.out).pipe(out);
```

## Handle protocol errors

```javascript
stream.in.on('error', function(err) {
  // ...
});

stream.out.on('error', function(err) {
  // ...
});
```

## License

MIT