(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = require('util/');
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"util/":12}],2:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

if (typeof module !== 'undefined') {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],3:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
/**
 * Root reference for iframes.
 */

var root;
if (typeof window !== 'undefined') { // Browser window
  root = window;
} else if (typeof self !== 'undefined') { // Web Worker
  root = self;
} else { // Other environments
  console.warn("Using browser-only version of superagent in non-browser environment");
  root = this;
}

var Emitter = require('component-emitter');
var RequestBase = require('./request-base');
var isObject = require('./is-object');
var ResponseBase = require('./response-base');
var shouldRetry = require('./should-retry');

/**
 * Noop.
 */

function noop(){};

/**
 * Expose `request`.
 */

var request = exports = module.exports = function(method, url) {
  // callback
  if ('function' == typeof url) {
    return new exports.Request('GET', method).end(url);
  }

  // url first
  if (1 == arguments.length) {
    return new exports.Request('GET', method);
  }

  return new exports.Request(method, url);
}

exports.Request = Request;

/**
 * Determine XHR.
 */

request.getXHR = function () {
  if (root.XMLHttpRequest
      && (!root.location || 'file:' != root.location.protocol
          || !root.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  throw Error("Browser-only version of superagent could not find XHR");
};

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

var trim = ''.trim
  ? function(s) { return s.trim(); }
  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    pushEncodedKeyValuePair(pairs, key, obj[key]);
  }
  return pairs.join('&');
}

/**
 * Helps 'serialize' with serializing arrays.
 * Mutates the pairs array.
 *
 * @param {Array} pairs
 * @param {String} key
 * @param {Mixed} val
 */

function pushEncodedKeyValuePair(pairs, key, val) {
  if (val != null) {
    if (Array.isArray(val)) {
      val.forEach(function(v) {
        pushEncodedKeyValuePair(pairs, key, v);
      });
    } else if (isObject(val)) {
      for(var subkey in val) {
        pushEncodedKeyValuePair(pairs, key + '[' + subkey + ']', val[subkey]);
      }
    } else {
      pairs.push(encodeURIComponent(key)
        + '=' + encodeURIComponent(val));
    }
  } else if (val === null) {
    pairs.push(encodeURIComponent(key));
  }
}

/**
 * Expose serialization method.
 */

 request.serializeObject = serialize;

 /**
  * Parse the given x-www-form-urlencoded `str`.
  *
  * @param {String} str
  * @return {Object}
  * @api private
  */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var pair;
  var pos;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    pos = pair.indexOf('=');
    if (pos == -1) {
      obj[decodeURIComponent(pair)] = '';
    } else {
      obj[decodeURIComponent(pair.slice(0, pos))] =
        decodeURIComponent(pair.slice(pos + 1));
    }
  }

  return obj;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'text/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

 request.serialize = {
   'application/x-www-form-urlencoded': serialize,
   'application/json': JSON.stringify
 };

 /**
  * Default parsers.
  *
  *     superagent.parse['application/xml'] = function(str){
  *       return { object parsed from str };
  *     };
  *
  */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  lines.pop(); // trailing CRLF

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}

/**
 * Check if `mime` is json or has +json structured syntax suffix.
 *
 * @param {String} mime
 * @return {Boolean}
 * @api private
 */

function isJSON(mime) {
  return /[\/+]json\b/.test(mime);
}

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(req) {
  this.req = req;
  this.xhr = this.req.xhr;
  // responseText is accessible only if responseType is '' or 'text' and on older browsers
  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
     ? this.xhr.responseText
     : null;
  this.statusText = this.req.xhr.statusText;
  var status = this.xhr.status;
  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
  if (status === 1223) {
      status = 204;
  }
  this._setStatusProperties(status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this._setHeaderProperties(this.header);

  if (null === this.text && req._responseType) {
    this.body = this.xhr.response;
  } else {
    this.body = this.req.method != 'HEAD'
      ? this._parseBody(this.text ? this.text : this.xhr.response)
      : null;
  }
}

ResponseBase(Response.prototype);

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype._parseBody = function(str){
  var parse = request.parse[this.type];
  if(this.req._parser) {
    return this.req._parser(this, str);
  }
  if (!parse && isJSON(this.type)) {
    parse = request.parse['application/json'];
  }
  return parse && str && (str.length || str instanceof Object)
    ? parse(str)
    : null;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function(){
  var req = this.req;
  var method = req.method;
  var url = req.url;

  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.url = url;

  return err;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {}; // preserves header name case
  this._header = {}; // coerces header names to lowercase
  this.on('end', function(){
    var err = null;
    var res = null;

    try {
      res = new Response(self);
    } catch(e) {
      err = new Error('Parser is unable to parse the response');
      err.parse = true;
      err.original = e;
      // issue #675: return the raw response if the response parsing fails
      if (self.xhr) {
        // ie9 doesn't have 'response' property
        err.rawResponse = typeof self.xhr.responseType == 'undefined' ? self.xhr.responseText : self.xhr.response;
        // issue #876: return the http status code if the response parsing fails
        err.status = self.xhr.status ? self.xhr.status : null;
        err.statusCode = err.status; // backwards-compat only
      } else {
        err.rawResponse = null;
        err.status = null;
      }

      return self.callback(err);
    }

    self.emit('response', res);

    var new_err;
    try {
      if (!self._isResponseOK(res)) {
        new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
        new_err.original = err;
        new_err.response = res;
        new_err.status = res.status;
      }
    } catch(e) {
      new_err = e; // #985 touching res may cause INVALID_STATE_ERR on old Android
    }

    // #1000 don't catch errors from the callback to avoid double calling it
    if (new_err) {
      self.callback(new_err, res);
    } else {
      self.callback(null, res);
    }
  });
}

/**
 * Mixin `Emitter` and `RequestBase`.
 */

Emitter(Request.prototype);
RequestBase(Request.prototype);

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function(type){
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function(type){
  this.set('Accept', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} [pass] optional in case of using 'bearer' as type
 * @param {Object} options with 'type' property 'auto', 'basic' or 'bearer' (default 'basic')
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function(user, pass, options){
  if (typeof pass === 'object' && pass !== null) { // pass is optional and can substitute for options
    options = pass;
  }
  if (!options) {
    options = {
      type: 'function' === typeof btoa ? 'basic' : 'auto',
    }
  }

  switch (options.type) {
    case 'basic':
      this.set('Authorization', 'Basic ' + btoa(user + ':' + pass));
    break;

    case 'auto':
      this.username = user;
      this.password = pass;
    break;

    case 'bearer': // usage would be .auth(accessToken, { type: 'bearer' })
      this.set('Authorization', 'Bearer ' + user);
    break;
  }
  return this;
};

/**
 * Add query-string `val`.
 *
 * Examples:
 *
 *   request.get('/shoes')
 *     .query('size=10')
 *     .query({ color: 'blue' })
 *
 * @param {Object|String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.query = function(val){
  if ('string' != typeof val) val = serialize(val);
  if (val) this._query.push(val);
  return this;
};

/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `options` (or filename).
 *
 * ``` js
 * request.post('/upload')
 *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String|Object} options
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.attach = function(field, file, options){
  if (file) {
    if (this._data) {
      throw Error("superagent can't mix .send() and .attach()");
    }

    this._getFormData().append(field, file, options || file.name);
  }
  return this;
};

Request.prototype._getFormData = function(){
  if (!this._formData) {
    this._formData = new root.FormData();
  }
  return this._formData;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function(err, res){
  // console.log(this._retries, this._maxRetries)
  if (this._maxRetries && this._retries++ < this._maxRetries && shouldRetry(err, res)) {
    return this._retry();
  }

  var fn = this._callback;
  this.clearTimeout();

  if (err) {
    if (this._maxRetries) err.retries = this._retries - 1;
    this.emit('error', err);
  }

  fn(err, res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function(){
  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
  err.crossDomain = true;

  err.status = this.status;
  err.method = this.method;
  err.url = this.url;

  this.callback(err);
};

// This only warns, because the request is still likely to work
Request.prototype.buffer = Request.prototype.ca = Request.prototype.agent = function(){
  console.warn("This is not supported in browser version of superagent");
  return this;
};

// This throws, because it can't send/receive data as expected
Request.prototype.pipe = Request.prototype.write = function(){
  throw Error("Streaming is not supported in browser version of superagent");
};

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */
Request.prototype._isHost = function _isHost(obj) {
  // Native objects stringify to [object File], [object Blob], [object FormData], etc.
  return obj && 'object' === typeof obj && !Array.isArray(obj) && Object.prototype.toString.call(obj) !== '[object Object]';
}

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function(fn){
  if (this._endCalled) {
    console.warn("Warning: .end() was called twice. This is not supported in superagent");
  }
  this._endCalled = true;

  // store callback
  this._callback = fn || noop;

  // querystring
  this._finalizeQueryString();

  return this._end();
};

Request.prototype._end = function() {
  var self = this;
  var xhr = this.xhr = request.getXHR();
  var data = this._formData || this._data;

  this._setTimeouts();

  // state change
  xhr.onreadystatechange = function(){
    var readyState = xhr.readyState;
    if (readyState >= 2 && self._responseTimeoutTimer) {
      clearTimeout(self._responseTimeoutTimer);
    }
    if (4 != readyState) {
      return;
    }

    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
    // result in the error "Could not complete the operation due to error c00c023f"
    var status;
    try { status = xhr.status } catch(e) { status = 0; }

    if (!status) {
      if (self.timedout || self._aborted) return;
      return self.crossDomainError();
    }
    self.emit('end');
  };

  // progress
  var handleProgress = function(direction, e) {
    if (e.total > 0) {
      e.percent = e.loaded / e.total * 100;
    }
    e.direction = direction;
    self.emit('progress', e);
  }
  if (this.hasListeners('progress')) {
    try {
      xhr.onprogress = handleProgress.bind(null, 'download');
      if (xhr.upload) {
        xhr.upload.onprogress = handleProgress.bind(null, 'upload');
      }
    } catch(e) {
      // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
      // Reported here:
      // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
    }
  }

  // initiate request
  try {
    if (this.username && this.password) {
      xhr.open(this.method, this.url, true, this.username, this.password);
    } else {
      xhr.open(this.method, this.url, true);
    }
  } catch (err) {
    // see #1149
    return this.callback(err);
  }

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if (!this._formData && 'GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !this._isHost(data)) {
    // serialize stuff
    var contentType = this._header['content-type'];
    var serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
    if (!serialize && isJSON(contentType)) {
      serialize = request.serialize['application/json'];
    }
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (null == this.header[field]) continue;

    if (this.header.hasOwnProperty(field))
      xhr.setRequestHeader(field, this.header[field]);
  }

  if (this._responseType) {
    xhr.responseType = this._responseType;
  }

  // send stuff
  this.emit('request', this);

  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
  // We need null here if data is undefined
  xhr.send(typeof data !== 'undefined' ? data : null);
  return this;
};

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.get = function(url, data, fn){
  var req = request('GET', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.head = function(url, data, fn){
  var req = request('HEAD', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * OPTIONS query to `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.options = function(url, data, fn){
  var req = request('OPTIONS', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * DELETE `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

function del(url, data, fn){
  var req = request('DELETE', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

request['del'] = del;
request['delete'] = del;

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.patch = function(url, data, fn){
  var req = request('PATCH', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.post = function(url, data, fn){
  var req = request('POST', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.put = function(url, data, fn){
  var req = request('PUT', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

},{"./is-object":5,"./request-base":6,"./response-base":7,"./should-retry":8,"component-emitter":2}],5:[function(require,module,exports){
/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return null !== obj && 'object' === typeof obj;
}

module.exports = isObject;

},{}],6:[function(require,module,exports){
/**
 * Module of mixed-in functions shared between node and client code
 */
var isObject = require('./is-object');

/**
 * Expose `RequestBase`.
 */

module.exports = RequestBase;

/**
 * Initialize a new `RequestBase`.
 *
 * @api public
 */

function RequestBase(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in RequestBase.prototype) {
    obj[key] = RequestBase.prototype[key];
  }
  return obj;
}

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.clearTimeout = function _clearTimeout(){
  clearTimeout(this._timer);
  clearTimeout(this._responseTimeoutTimer);
  delete this._timer;
  delete this._responseTimeoutTimer;
  return this;
};

/**
 * Override default response body parser
 *
 * This function will be called to convert incoming data into request.body
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.parse = function parse(fn){
  this._parser = fn;
  return this;
};

/**
 * Set format of binary response body.
 * In browser valid formats are 'blob' and 'arraybuffer',
 * which return Blob and ArrayBuffer, respectively.
 *
 * In Node all values result in Buffer.
 *
 * Examples:
 *
 *      req.get('/')
 *        .responseType('blob')
 *        .end(callback);
 *
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.responseType = function(val){
  this._responseType = val;
  return this;
};

/**
 * Override default request body serializer
 *
 * This function will be called to convert data set via .send or .attach into payload to send
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.serialize = function serialize(fn){
  this._serializer = fn;
  return this;
};

/**
 * Set timeouts.
 *
 * - response timeout is time between sending request and receiving the first byte of the response. Includes DNS and connection time.
 * - deadline is the time from start of the request to receiving response body in full. If the deadline is too short large files may not load at all on slow connections.
 *
 * Value of 0 or false means no timeout.
 *
 * @param {Number|Object} ms or {response, deadline}
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.timeout = function timeout(options){
  if (!options || 'object' !== typeof options) {
    this._timeout = options;
    this._responseTimeout = 0;
    return this;
  }

  for(var option in options) {
    switch(option) {
      case 'deadline':
        this._timeout = options.deadline;
        break;
      case 'response':
        this._responseTimeout = options.response;
        break;
      default:
        console.warn("Unknown timeout option", option);
    }
  }
  return this;
};

/**
 * Set number of retry attempts on error.
 *
 * Failed requests will be retried 'count' times if timeout or err.code >= 500.
 *
 * @param {Number} count
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.retry = function retry(count){
  // Default to 1 if no count passed or true
  if (arguments.length === 0 || count === true) count = 1;
  if (count <= 0) count = 0;
  this._maxRetries = count;
  this._retries = 0;
  return this;
};

/**
 * Retry request
 *
 * @return {Request} for chaining
 * @api private
 */

RequestBase.prototype._retry = function() {
  this.clearTimeout();

  // node
  if (this.req) {
    this.req = null;
    this.req = this.request();
  }

  this._aborted = false;
  this.timedout = false;

  return this._end();
};

/**
 * Promise support
 *
 * @param {Function} resolve
 * @param {Function} [reject]
 * @return {Request}
 */

RequestBase.prototype.then = function then(resolve, reject) {
  if (!this._fullfilledPromise) {
    var self = this;
    if (this._endCalled) {
      console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises");
    }
    this._fullfilledPromise = new Promise(function(innerResolve, innerReject){
      self.end(function(err, res){
        if (err) innerReject(err); else innerResolve(res);
      });
    });
  }
  return this._fullfilledPromise.then(resolve, reject);
}

RequestBase.prototype.catch = function(cb) {
  return this.then(undefined, cb);
};

/**
 * Allow for extension
 */

RequestBase.prototype.use = function use(fn) {
  fn(this);
  return this;
}

RequestBase.prototype.ok = function(cb) {
  if ('function' !== typeof cb) throw Error("Callback required");
  this._okCallback = cb;
  return this;
};

RequestBase.prototype._isResponseOK = function(res) {
  if (!res) {
    return false;
  }

  if (this._okCallback) {
    return this._okCallback(res);
  }

  return res.status >= 200 && res.status < 300;
};


/**
 * Get request header `field`.
 * Case-insensitive.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

RequestBase.prototype.get = function(field){
  return this._header[field.toLowerCase()];
};

/**
 * Get case-insensitive header `field` value.
 * This is a deprecated internal API. Use `.get(field)` instead.
 *
 * (getHeader is no longer used internally by the superagent code base)
 *
 * @param {String} field
 * @return {String}
 * @api private
 * @deprecated
 */

RequestBase.prototype.getHeader = RequestBase.prototype.get;

/**
 * Set header `field` to `val`, or multiple fields with one object.
 * Case-insensitive.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.set = function(field, val){
  if (isObject(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};

/**
 * Remove header `field`.
 * Case-insensitive.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field
 */
RequestBase.prototype.unset = function(field){
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};

/**
 * Write the field `name` and `val`, or multiple fields with one object
 * for "multipart/form-data" request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 *
 * request.post('/upload')
 *   .field({ foo: 'bar', baz: 'qux' })
 *   .end(callback);
 * ```
 *
 * @param {String|Object} name
 * @param {String|Blob|File|Buffer|fs.ReadStream} val
 * @return {Request} for chaining
 * @api public
 */
RequestBase.prototype.field = function(name, val) {

  // name should be either a string or an object.
  if (null === name ||  undefined === name) {
    throw new Error('.field(name, val) name can not be empty');
  }

  if (this._data) {
    console.error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObject(name)) {
    for (var key in name) {
      this.field(key, name[key]);
    }
    return this;
  }

  if (Array.isArray(val)) {
    for (var i in val) {
      this.field(name, val[i]);
    }
    return this;
  }

  // val should be defined now
  if (null === val || undefined === val) {
    throw new Error('.field(name, val) val can not be empty');
  }
  if ('boolean' === typeof val) {
    val = '' + val;
  }
  this._getFormData().append(name, val);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */
RequestBase.prototype.abort = function(){
  if (this._aborted) {
    return this;
  }
  this._aborted = true;
  this.xhr && this.xhr.abort(); // browser
  this.req && this.req.abort(); // node
  this.clearTimeout();
  this.emit('abort');
  return this;
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */

RequestBase.prototype.withCredentials = function(on){
  // This is browser-only functionality. Node side is no-op.
  if(on==undefined) on = true;
  this._withCredentials = on;
  return this;
};

/**
 * Set the max redirects to `n`. Does noting in browser XHR implementation.
 *
 * @param {Number} n
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.redirects = function(n){
  this._maxRedirects = n;
  return this;
};

/**
 * Convert to a plain javascript object (not JSON string) of scalar properties.
 * Note as this method is designed to return a useful non-this value,
 * it cannot be chained.
 *
 * @return {Object} describing method, url, and data of this request
 * @api public
 */

RequestBase.prototype.toJSON = function(){
  return {
    method: this.method,
    url: this.url,
    data: this._data,
    headers: this._header
  };
};


/**
 * Send `data` as the request body, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"}')
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
 *      request.post('/user')
 *        .send('name=tobi')
 *        .send('species=ferret')
 *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.send = function(data){
  var isObj = isObject(data);
  var type = this._header['content-type'];

  if (this._formData) {
    console.error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObj && !this._data) {
    if (Array.isArray(data)) {
      this._data = [];
    } else if (!this._isHost(data)) {
      this._data = {};
    }
  } else if (data && this._data && this._isHost(this._data)) {
    throw Error("Can't merge these send calls");
  }

  // merge
  if (isObj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    // default to x-www-form-urlencoded
    if (!type) this.type('form');
    type = this._header['content-type'];
    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data
        ? this._data + '&' + data
        : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!isObj || this._isHost(data)) {
    return this;
  }

  // default to json
  if (!type) this.type('json');
  return this;
};


/**
 * Sort `querystring` by the sort function
 *
 *
 * Examples:
 *
 *       // default order
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery()
 *         .end(callback)
 *
 *       // customized sort function
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery(function(a, b){
 *           return a.length - b.length;
 *         })
 *         .end(callback)
 *
 *
 * @param {Function} sort
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.sortQuery = function(sort) {
  // _sort default to true but otherwise can be a function or boolean
  this._sort = typeof sort === 'undefined' ? true : sort;
  return this;
};

/**
 * Compose querystring to append to req.url
 *
 * @api private
 */
RequestBase.prototype._finalizeQueryString = function(){
  var query = this._query.join('&');
  if (query) {
    this.url += (this.url.indexOf('?') >= 0 ? '&' : '?') + query;
  }
  this._query.length = 0; // Makes the call idempotent

  if (this._sort) {
    var index = this.url.indexOf('?');
    if (index >= 0) {
      var queryArr = this.url.substring(index + 1).split('&');
      if ('function' === typeof this._sort) {
        queryArr.sort(this._sort);
      } else {
        queryArr.sort();
      }
      this.url = this.url.substring(0, index) + '?' + queryArr.join('&');
    }
  }
};

// For backwards compat only
RequestBase.prototype._appendQueryString = function() {console.trace("Unsupported");}

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

RequestBase.prototype._timeoutError = function(reason, timeout, errno){
  if (this._aborted) {
    return;
  }
  var err = new Error(reason + timeout + 'ms exceeded');
  err.timeout = timeout;
  err.code = 'ECONNABORTED';
  err.errno = errno;
  this.timedout = true;
  this.abort();
  this.callback(err);
};

RequestBase.prototype._setTimeouts = function() {
  var self = this;

  // deadline
  if (this._timeout && !this._timer) {
    this._timer = setTimeout(function(){
      self._timeoutError('Timeout of ', self._timeout, 'ETIME');
    }, this._timeout);
  }
  // response timeout
  if (this._responseTimeout && !this._responseTimeoutTimer) {
    this._responseTimeoutTimer = setTimeout(function(){
      self._timeoutError('Response timeout of ', self._responseTimeout, 'ETIMEDOUT');
    }, this._responseTimeout);
  }
}

},{"./is-object":5}],7:[function(require,module,exports){

/**
 * Module dependencies.
 */

var utils = require('./utils');

/**
 * Expose `ResponseBase`.
 */

module.exports = ResponseBase;

/**
 * Initialize a new `ResponseBase`.
 *
 * @api public
 */

function ResponseBase(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in ResponseBase.prototype) {
    obj[key] = ResponseBase.prototype[key];
  }
  return obj;
}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

ResponseBase.prototype.get = function(field){
    return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

ResponseBase.prototype._setHeaderProperties = function(header){
    // TODO: moar!
    // TODO: make this a util

    // content-type
    var ct = header['content-type'] || '';
    this.type = utils.type(ct);

    // params
    var params = utils.params(ct);
    for (var key in params) this[key] = params[key];

    this.links = {};

    // links
    try {
        if (header.link) {
            this.links = utils.parseLinks(header.link);
        }
    } catch (err) {
        // ignore
    }
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

ResponseBase.prototype._setStatusProperties = function(status){
    var type = status / 100 | 0;

    // status / class
    this.status = this.statusCode = status;
    this.statusType = type;

    // basics
    this.info = 1 == type;
    this.ok = 2 == type;
    this.redirect = 3 == type;
    this.clientError = 4 == type;
    this.serverError = 5 == type;
    this.error = (4 == type || 5 == type)
        ? this.toError()
        : false;

    // sugar
    this.accepted = 202 == status;
    this.noContent = 204 == status;
    this.badRequest = 400 == status;
    this.unauthorized = 401 == status;
    this.notAcceptable = 406 == status;
    this.forbidden = 403 == status;
    this.notFound = 404 == status;
};

},{"./utils":9}],8:[function(require,module,exports){
var ERROR_CODES = [
  'ECONNRESET',
  'ETIMEDOUT',
  'EADDRINFO',
  'ESOCKETTIMEDOUT'
];

/**
 * Determine if a request should be retried.
 * (Borrowed from segmentio/superagent-retry)
 *
 * @param {Error} err
 * @param {Response} [res]
 * @returns {Boolean}
 */
module.exports = function shouldRetry(err, res) {
  if (err && err.code && ~ERROR_CODES.indexOf(err.code)) return true;
  if (res && res.status && res.status >= 500) return true;
  // Superagent timeout
  if (err && 'timeout' in err && err.code == 'ECONNABORTED') return true;
  if (err && 'crossDomain' in err) return true;
  return false;
};

},{}],9:[function(require,module,exports){

/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

exports.type = function(str){
  return str.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.params = function(str){
  return str.split(/ *; */).reduce(function(obj, str){
    var parts = str.split(/ *= */);
    var key = parts.shift();
    var val = parts.shift();

    if (key && val) obj[key] = val;
    return obj;
  }, {});
};

/**
 * Parse Link header fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.parseLinks = function(str){
  return str.split(/ *, */).reduce(function(obj, str){
    var parts = str.split(/ *; */);
    var url = parts[0].slice(1, -1);
    var rel = parts[1].split(/ *= */)[1].slice(1, -1);
    obj[rel] = url;
    return obj;
  }, {});
};

/**
 * Strip content related fields from `header`.
 *
 * @param {Object} header
 * @return {Object} header
 * @api private
 */

exports.cleanHeader = function(header, shouldStripCookie){
  delete header['content-type'];
  delete header['content-length'];
  delete header['transfer-encoding'];
  delete header['host'];
  if (shouldStripCookie) {
    delete header['cookie'];
  }
  return header;
};
},{}],10:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],11:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],12:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":11,"_process":3,"inherits":10}],13:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : _typeof2(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof2(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var PieceMakerApi = function () {
  // Class PieceMakerApi
  // ---------------------
  // new PieceMakerApi( <string> host [, <string> api_key ] )
  //
  // If the api_key is not present you must use login() before being
  // able to issue any other calls to the API.

  function PieceMakerApi(host) {
    var apiAccessKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

    _classCallCheck(this, PieceMakerApi);

    _assert2.default.equal(typeof host === 'undefined' ? 'undefined' : _typeof(host), 'string', 'Host must be string');
    this.host = host + '/api/v1';
    if (typeof apiAccessKey === 'string') this.api_access_key = apiAccessKey;
  }

  // Users
  // ------
  // ###Log a user in

  // If the user has no API key, this will generate one

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/user/POST_api_version_user_login_format

  // ```
  // api.login( <string> email, <string> password )
  // ```

  // Returns a promise yielding the access key

  _createClass(PieceMakerApi, [{
    key: 'login',
    value: function login(email, password) {
      _assert2.default.equal(typeof email === 'undefined' ? 'undefined' : _typeof(email), 'string', 'email must be string');
      _assert2.default.equal(typeof password === 'undefined' ? 'undefined' : _typeof(password), 'string', 'password must be string');
      var ctx = this;
      return this._apiRequest('/user/login', 'POST', { email: email, password: password }).then(function (res) {
        ctx.api_access_key = res.api_access_key;
        return res;
      });
    }

    // ###Log a user out

    // Clears the stored access key

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/user/POST_api_version_user_logout_format

    // ```
    // api.logout()
    // ```

  }, {
    key: 'logout',
    value: function logout() {
      this.api_access_key = undefined;
    }

    // ###Get all users

    // Returns a list of all users

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/users/GET_api_version_users_format

    // ```
    // api.listUsers()
    // ```

    // Returns promise yielding list of users

  }, {
    key: 'listUsers',
    value: function listUsers() {
      return this._apiRequest('/users');
    }

    // ###Get current user

    // Returns the currently logged in user by looking up the active API key

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/user/GET_api_version_user_me_format

    // ```
    // api.whoAmI()
    // ```

    // Returns promise yielding current user

  }, {
    key: 'whoAmI',
    value: function whoAmI() {
      return this._apiRequest('/user/me');
    }

    // ###Create a user

    // Role id is optional, if none is provided it will be "user" (no permissions)

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/user/POST_api_version_user_format

    // ```
    // api.createUser( <string> name, <string> email [, <string> roleId ] )
    // ```

    // Returns promise yielding created user

  }, {
    key: 'createUser',
    value: function createUser(name, email) {
      var roleId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

      _assert2.default.equal(typeof name === 'undefined' ? 'undefined' : _typeof(name), 'string', 'name must be string');
      _assert2.default.equal(typeof email === 'undefined' ? 'undefined' : _typeof(email), 'string', 'email must be string');
      if (roleId) _assert2.default.equal(typeof roleId === 'undefined' ? 'undefined' : _typeof(roleId), 'string', 'roleId must be string');
      return this._apiRequest('/user', 'POST', { name: name, email: email, user_role_id: roleId });
    }

    // ###Get one user by id

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/user/GET_api_version_user_id_format

    // ```
    // api.getUser( <int> id )
    // ```

    // Returns promise yielding user

  }, {
    key: 'getUser',
    value: function getUser(id) {
      _assert2.default.equal(typeof id === 'undefined' ? 'undefined' : _typeof(id), 'number', 'id must be number');
      return this._apiRequest('/user/' + id);
    }

    // ###Update a user

    // Updating can change name, email or role_id and
    // it can disable a user and recreate a new password.

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/user/PUT_api_version_user_id_format

    // Versions:
    // ```
    // api.updateUser( <int> id, <string> name, <string> email )
    // api.updateUser( <int> id, <string> name, <string> email, <boolean> disable, <boolean> refreshPassword )
    // ```

    // Returns promise yielding updated user

  }, {
    key: 'updateUser',
    value: function updateUser(id, name, email) {
      var disable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
      var refreshPassword = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

      // TODO: change this to take a user id and an object containing the update payload
      _assert2.default.equal(typeof id === 'undefined' ? 'undefined' : _typeof(id), 'number', 'id must be number');
      _assert2.default.equal(typeof name === 'undefined' ? 'undefined' : _typeof(name), 'string', 'name must be string');
      _assert2.default.equal(typeof email === 'undefined' ? 'undefined' : _typeof(email), 'string', 'email must be string');
      if (disable) _assert2.default.equal(typeof disable === 'undefined' ? 'undefined' : _typeof(disable), 'boolean', 'disable must be boolean');
      if (refreshPassword) _assert2.default.equal(typeof refreshPassword === 'undefined' ? 'undefined' : _typeof(refreshPassword), 'boolean', 'refreshPassword must be boolean');
      return this._apiRequest('/user/' + id, 'PUT', {
        name: name,
        email: email,
        is_disabled: disable,
        new_password: refreshPassword
      });
    }

    // ###Delete one user

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/user/DELETE_api_version_user_id_format

    // ```
    // api.deleteUser( <int> id )
    // ```

    // Returns promise

  }, {
    key: 'deleteUser',
    value: function deleteUser(id) {
      return this._apiRequest('/user/' + id, 'DELETE');
    }

    // ###Get all groups visible to given user

    // This returns a list of groups that the user belongs to

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/user/GET_api_version_user_id_groups_format

    // ```
    // api.userGroups( <int> user_id )
    // ```

    // Returns promise yielding the group list

  }, {
    key: 'userGroups',
    value: function userGroups(id) {
      return this._apiRequest('/user/' + id + '/groups');
    }

    // Groups
    // -------

    // Groups are what Piecemaker 1 called a "piece":
    // a collection of events (markers, videos, recordings, ...)

    // ###Get all groups

    // This returns a list of all groups (super admin only)

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/groups/GET_api_version_groups_format

    // ```
    // api.listGroups()
    // ```

    // Returns promise yielding the group list

  }, {
    key: 'listGroups',
    value: function listGroups() {
      return this._apiRequest('/groups');
    }

    // ###Get all groups

    // Get a list of all available groups

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/groups/GET_api_version_groups_all_format

    // ```
    // api.listAllGroups()
    // ```

    // Returns promise yielding the group list

  }, {
    key: 'listAllGroups',
    value: function listAllGroups() {
      return this._apiRequest('/groups/all');
    }

    // ###Create a group

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/group/POST_api_version_group_format

    // ```
    // api.createGroup( <string> title [, <string> description ] )
    // ```

    // Returns promise yielding the created group

  }, {
    key: 'createGroup',
    value: function createGroup(title) {
      var description = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      _assert2.default.equal(typeof title === 'undefined' ? 'undefined' : _typeof(title), 'string', 'title must be string');
      _assert2.default.equal(typeof description === 'undefined' ? 'undefined' : _typeof(description), 'string', 'description must be string');
      return this._apiRequest('/group', 'POST', {
        title: title,
        description: description
      });
    }

    // ###Get a group by id

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/group/GET_api_version_group_id_format

    // ```
    // api.getGroup( <int> id )
    // ```

    // Returns promise yielding the group

  }, {
    key: 'getGroup',
    value: function getGroup(id) {
      _assert2.default.equal(typeof id === 'undefined' ? 'undefined' : _typeof(id), 'number', 'id must be number');
      return this._apiRequest('/group/' + id);
    }

    // ###Update a group by id

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/group/PUT_api_version_group_id_format

    // ```
    // api.updateGroup( <int> group_id, <object> data )
    // ```
    // where data is
    // ```
    // {
    //   title : <string>,
    //   text :  <string>
    // }
    // ```

    // Returns promise yielding the updated group

  }, {
    key: 'updateGroup',
    value: function updateGroup(id, data) {
      _assert2.default.equal(typeof id === 'undefined' ? 'undefined' : _typeof(id), 'number', 'id must be number');
      _assert2.default.equal(typeof data === 'undefined' ? 'undefined' : _typeof(data), 'object', 'data must be object');
      data = PieceMakerApi._convertData(data);
      return this._apiRequest('/group/' + id, 'PUT', data);
    }

    // ###Delete a group

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/group/DELETE_api_version_group_id_format

    // ```
    // api.deleteGroup( <int> id )
    // ```

  }, {
    key: 'deleteGroup',
    value: function deleteGroup(id) {
      _assert2.default.equal(typeof id === 'undefined' ? 'undefined' : _typeof(id), 'number', 'id must be number');
      return this._apiRequest('/group/' + id, 'DELETE');
    }

    // ###Get all users in this group

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/group/GET_api_version_group_id_users_format

    // ```
    // api.listGroupUsers( <int> id )
    // ```

    // Returns promise yielding all users in that group

  }, {
    key: 'listGroupUsers',
    value: function listGroupUsers(id) {
      _assert2.default.equal(typeof id === 'undefined' ? 'undefined' : _typeof(id), 'number', 'id must be number');
      return this._apiRequest('/group/' + id + '/users');
    }

    // ###Add a user to a group

    // Expects a user role id to be given as which the user will act in the group

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/group/POST_api_version_group_event_group_id_user_user_id_format

    // ```
    // api.addUserToGroup( <int> id, <int> userId, <string> roleId )
    // ```

    // TODO: check what this returns

  }, {
    key: 'addUserToGroup',
    value: function addUserToGroup(id, userId, roleId) {
      _assert2.default.equal(typeof id === 'undefined' ? 'undefined' : _typeof(id), 'number', 'id must be number');
      _assert2.default.equal(typeof userId === 'undefined' ? 'undefined' : _typeof(userId), 'number', 'userId must be number');
      _assert2.default.equal(typeof roleId === 'undefined' ? 'undefined' : _typeof(roleId), 'string', 'roleId must be string');
      return this._apiRequest('/group/' + id + '/user/' + userId, 'POST', {
        user_role_id: roleId
      });
    }

    // ###Change a users role in a group

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/group/PUT_api_version_group_event_group_id_user_user_id_format

    // ```
    // api.changeUserRoleInGroup( <int> id, <int> userId, <string> roleId )
    // ```

    // TODO: check what this returns

  }, {
    key: 'changeUserRoleInGroup',
    value: function changeUserRoleInGroup(id, userId, roleId) {
      _assert2.default.equal(typeof id === 'undefined' ? 'undefined' : _typeof(id), 'number', 'id must be number');
      _assert2.default.equal(typeof userId === 'undefined' ? 'undefined' : _typeof(userId), 'number', 'userId must be number');
      _assert2.default.equal(typeof roleId === 'undefined' ? 'undefined' : _typeof(roleId), 'string', 'roleId must be string');
      return this._apiRequest('/group/' + id + '/user/' + userId, 'PUT', {
        user_role_id: roleId
      });
    }

    // ###Remove user from group

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/group/DELETE_api_version_group_event_group_id_user_user_id_format

    // ```
    // api.removeUserFromGroup( <int> id, <int> userId )
    // ```

    // TODO: check what this returns

  }, {
    key: 'removeUserFromGroup',
    value: function removeUserFromGroup(id, userId) {
      _assert2.default.equal(typeof id === 'undefined' ? 'undefined' : _typeof(id), 'number', 'id must be number');
      _assert2.default.equal(typeof userId === 'undefined' ? 'undefined' : _typeof(userId), 'number', 'userId must be number');
      return this._apiRequest('/group/' + id + '/user/' + userId, 'DELETE');
    }

    // Roles
    // -------

    // A role is a predefined set of permissions. Each user has a global role and
    // roles per group that he/she is part of. Roles can inherit permissions from
    // other roles.

    // ###List all available roles

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/roles/GET_api_version_roles_format

    // ```
    // api.listRoles()
    // ```

    // Returns promise yielding all available roles

  }, {
    key: 'listRoles',
    value: function listRoles() {
      return this._apiRequest('/roles');
    }

    // ###Add new role

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/role/POST_api_version_role_format

    // ```
    // api.createRole( <string> roleId [, <string> inheritRoleId ] [, <string> description ] )
    // ```

    // Returns promise yielding the new role created

  }, {
    key: 'createRole',
    value: function createRole(roleId) {
      var inheritRoleId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      var description = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

      _assert2.default.equal(typeof roleId === 'undefined' ? 'undefined' : _typeof(roleId), 'string', 'roleId must be number');
      if (typeof inheritRoleId !== 'undefined') {
        _assert2.default.equal(typeof inheritRoleId === 'undefined' ? 'undefined' : _typeof(inheritRoleId), 'number', 'inheritRoleId must be number');
      }
      if (typeof description !== 'undefined') {
        _assert2.default.equal(typeof description === 'undefined' ? 'undefined' : _typeof(description), 'string', 'description must be string');
      }
      return this._apiRequest('/role', 'POST', {
        id: roleId,
        inherit_from_id: inheritRoleId,
        description: description
      });
    }

    // ###Update role

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/role/PUT_api_version_role_id_format

    // ```
    // api.updateRole( <string> roleId, [, <string> inheritRoleId ] [, <string> description ] )
    // ```

    // Returns promise yielding the updated role

  }, {
    key: 'updateRole',
    value: function updateRole(roleId) {
      var inheritRoleId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      var description = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

      _assert2.default.equal(typeof roleId === 'undefined' ? 'undefined' : _typeof(roleId), 'string', 'roleId must be string');
      if (typeof inheritRoleId !== 'undefined') {
        _assert2.default.equal(typeof inheritRoleId === 'undefined' ? 'undefined' : _typeof(inheritRoleId), 'string', 'inheritRoleId must be string');
      }
      if (typeof description !== 'undefined') {
        _assert2.default.equal(typeof description === 'undefined' ? 'undefined' : _typeof(description), 'string', 'description must be string');
      }
      return this._apiRequest('/role/' + roleId, 'PUT', {
        inherit_from_id: inheritRoleId,
        description: description
      });
    }

    // ###Delete a role

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/role/DELETE_api_version_role_id_format

    // ```
    // api.deleteRole( <string> roleId )
    // ```

  }, {
    key: 'deleteRole',
    value: function deleteRole(roleId) {
      _assert2.default.equal(typeof roleId === 'undefined' ? 'undefined' : _typeof(roleId), 'string', 'roleId must be string');
      return this._apiRequest('/role/' + roleId, 'DELETE');
    }

    // ###Get a role by id

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/role/GET_api_version_role_id_format

    // ```
    // api.getRole( <string> roleId )
    // ```

    // Returns promise yielding the role

  }, {
    key: 'getRole',
    value: function getRole(roleId) {
      _assert2.default.equal(typeof roleId === 'undefined' ? 'undefined' : _typeof(roleId), 'string', 'roleId must be string');
      return this._apiRequest('/role/' + roleId);
    }

    // Role permissions
    // --------

    // A permission reflects a certain action on the server that can be triggered through the API.
    // Each permission can be set to allow or forbid one action.
    // Permissions are grouped into roles to allow for fine grained user rights control.

    // Permissions are predefined (hard coded) into the API, use listPermissions() to get a list.

    // ###Get all permissions

    // Only the permissions returned by this call are available

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/permissions/GET_api_version_permissions_format

    // ```
    // api.listPermissions()
    // ```

    // Returns promise yielding an array of permissions

  }, {
    key: 'listPermissions',
    value: function listPermissions() {
      return this._apiRequest('/permissions');
    }

    // ###Add a permission to a role

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/role/POST_api_version_role_format

    // ```
    // api.addPermissionToRole( <string> roleId, <string> action [, <boolean> isAllowed ] );
    // ```
    // "action" as available through listPermissions()

    // TODO: check what this returns

  }, {
    key: 'addPermissionToRole',
    value: function addPermissionToRole(roleId, action) {
      var isAllowed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      _assert2.default.equal(typeof roleId === 'undefined' ? 'undefined' : _typeof(roleId), 'string', 'roleId must be string');
      _assert2.default.equal(typeof action === 'undefined' ? 'undefined' : _typeof(action), 'string', 'action must be string');
      _assert2.default.equal(typeof isAllowed === 'undefined' ? 'undefined' : _typeof(isAllowed), 'boolean', 'isAllowed must be boolean');
      return this._apiRequest('/role/' + roleId + '/permission', 'POST', {
        action: action,
        // TODO: dear api "programmer", what's a bool? hint: it's not something you smoke
        allowed: isAllowed ? 'yes' : 'no'
      });
    }

    // ###Change a role permission

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/role/PUT_api_version_role_user_role_id_permission_role_permission_entity_format

    // ```
    // api.changePermissionForRole( <string> roleId, <string> action, <string> right )
    // ```
    // "action" as available through listPermissions()
    // "isAllowed" can be true or false

    // TODO: check what this returns

  }, {
    key: 'changePermissionForRole',
    value: function changePermissionForRole(roleId, action, isAllowed) {
      _assert2.default.equal(typeof roleId === 'undefined' ? 'undefined' : _typeof(roleId), 'string', 'roleId must be string');
      _assert2.default.equal(typeof action === 'undefined' ? 'undefined' : _typeof(action), 'string', 'action must be string');
      _assert2.default.equal(typeof isAllowed === 'undefined' ? 'undefined' : _typeof(isAllowed), 'boolean', 'isAllowed must be boolean');
      return this._apiRequest('/role/' + roleId + '/permission/' + action, 'PUT', {
        // TODO: oh, get out.
        allowed: isAllowed ? 'yes' : 'no'
      });
    }

    // ###Remove a permission from a role

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/role/DELETE_api_version_role_user_role_id_permission_role_permission_entity_format

    // ```
    // api.removePermissionFromRole( <string> roleId, <string> action )
    // ```

  }, {
    key: 'removePermissionFromRole',
    value: function removePermissionFromRole(roleId, action) {
      _assert2.default.equal(typeof roleId === 'undefined' ? 'undefined' : _typeof(roleId), 'string', 'roleId must be string');
      _assert2.default.equal(typeof action === 'undefined' ? 'undefined' : _typeof(action), 'string', 'action must be string');
      return this._apiRequest('/role/' + roleId + '/permission/' + action, 'DELETE');
    }

    // ###Get a role permission

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/role/GET_api_version_role_user_role_id_permission_role_permission_entity_format

    // ```
    // api.getPermissionFromRole( <string> roleId, <string> action )
    // ```

    // Returns promise yielding the permission

  }, {
    key: 'getPermissionFromRole',
    value: function getPermissionFromRole(roleId, action) {
      _assert2.default.equal(typeof roleId === 'undefined' ? 'undefined' : _typeof(roleId), 'string', 'roleId must be string');
      _assert2.default.equal(typeof action === 'undefined' ? 'undefined' : _typeof(action), 'string', 'action must be string');
      return this._apiRequest('/role/' + roleId + '/permission/' + action);
    }

    // Events
    // --------

    // Anything on a timeline is an event in Piecemaker. That includes videos, data, annotations, ...

    // A bare event is a point in time (utc_timestamp), a duration in seconds and a type.
    // Each event can have an undefined amount of additional fields in the form of {key:value}.

    // ###Get all events from a group

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/group/GET_api_version_group_id_events_format

    // ```
    // api.listEvents( <int> groupId )
    // ```

    // Returns promise yielding all events in the group

  }, {
    key: 'listEvents',
    value: function listEvents(groupId) {
      _assert2.default.equal(typeof groupId === 'undefined' ? 'undefined' : _typeof(groupId), 'number', 'groupId must be number');
      return this._apiRequest('/group/' + groupId + '/events', undefined, PieceMakerApi._fixEventsResponse);
    }

    // ###Get all event types from a group

    // See:
    //

    // ```
    // api.listEventTypes( <int> groupId )
    // ```

    // Returns promise yielding an array with all distinct event types in the group

  }, {
    key: 'listEventTypes',
    value: function listEventTypes(groupId) {
      _assert2.default.equal(typeof groupId === 'undefined' ? 'undefined' : _typeof(groupId), 'number', 'groupId must be number');
      return this._apiRequest('/group/' + groupId + '/event-types', undefined, PieceMakerApi._fixEventsResponse);
    }

    // ###Get all events of a certain type

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/group/GET_api_version_group_id_events_format

    // ```
    // api.listEventsOfType( <int> group_id, <string> type )
    // ```

    // Returns promise yielding an array of events

  }, {
    key: 'listEventsOfType',
    value: function listEventsOfType(groupId, type) {
      _assert2.default.equal(typeof groupId === 'undefined' ? 'undefined' : _typeof(groupId), 'number', 'groupId must be number');
      _assert2.default.equal(typeof type === 'undefined' ? 'undefined' : _typeof(type), 'string', 'type must be string');
      // TODO: bad api design, type should be part of path instead of query params
      return this._apiRequest('/group/' + groupId + '/events', 'GET', { type: type }, PieceMakerApi._fixEventsResponse);
    }

    // ###Get all events that have certain fields (id and value must match)

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/group/GET_api_version_group_id_events_format

    // ```
    // api.listEventsWithFields( <int> groupId [, <object> fields ] )
    // ```
    // The second parameter is an object with key-values:
    // ```
    // {
    //    key1 : value1,
    //    key2 : value2,
    //    ...
    // }
    // ```

    // Returns promise yielding an array of events

  }, {
    key: 'listEventsWithFields',
    value: function listEventsWithFields(groupId) {
      var fields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

      _assert2.default.equal(typeof groupId === 'undefined' ? 'undefined' : _typeof(groupId), 'number', 'groupId must be number');
      if (fields) {
        _assert2.default.equal(typeof fields === 'undefined' ? 'undefined' : _typeof(fields), 'object', 'fields must be object');
      }
      return this._apiRequest('/group/' + groupId + '/events', 'GET', { fields: fields }, PieceMakerApi._fixEventsResponse);
    }

    // ###Get all events that happened within given timeframe

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/group/GET_api_version_group_id_events_format

    // Versions:
    // ```
    // TODO: check for a better way to express the optional date ranges
    // api.listEventsForTimespan( <int> groupId, <date> from, <date> to [, <string> method ] )
    // ```

    // If either *to* or *from* are undefined it is like saying *before to* or *after from*.

    // The *method* parameter is optional, can be any of:
    // ```
    // 'utc_timestamp', looking only at the start points
    // 'intersect', returning events that intersect the given time span or are contained within
    // 'contain', returning events that are fully contained (start+duration) in time span
    // ```
    // See here for details:
    // https://github.com/motionbank/piecemaker2-api/issues/76#issuecomment-37030586

    // Returns promise yielding an array of events

  }, {
    key: 'listEventsForTimespan',
    value: function listEventsForTimespan(groupId) {
      var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      var to = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      var method = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'intersect';

      _assert2.default.equal(typeof groupId === 'undefined' ? 'undefined' : _typeof(groupId), 'number', 'groupId must be number');
      _assert2.default.ok(from || to, 'at least either from or to must be defined');
      if (from) {
        _assert2.default.equal(typeof from === 'undefined' ? 'undefined' : _typeof(from), 'date', 'from must be date');
      }
      if (to) {
        _assert2.default.equal(typeof to === 'undefined' ? 'undefined' : _typeof(to), 'date', 'to must be date');
      }
      _assert2.default.equal(typeof method === 'undefined' ? 'undefined' : _typeof(method), 'string', 'method must be string');
      _assert2.default.notEqual(['utc_timestamp', 'intersect', 'contain'].indexOf(method), -1, 'method must be one of: "utc_timestamp", "intersect" or "contain" (case-sensitive)');
      return this._apiRequest('/group/' + groupId + '/events', 'GET', {
        from: from ? PieceMakerApi._jsDateToTs(from) : undefined,
        to: to ? PieceMakerApi._jsDateToTs(to) : undefined,
        fromto_query: method
      }, PieceMakerApi._fixEventsResponse);
    }

    // ###Get all events that match

    // This is a very generic method that allows for more complex searches

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/group/GET_api_version_group_id_events_format

    // ```
    // api.findEvents( <int> groupId, <object> query )
    // ```

    // Returns promise yielding an array of events

  }, {
    key: 'findEvents',
    value: function findEvents(groupId, query) {
      _assert2.default.equal(typeof groupId === 'undefined' ? 'undefined' : _typeof(groupId), 'number', 'groupId must be number');
      _assert2.default.equal(typeof query === 'undefined' ? 'undefined' : _typeof(query), 'object', 'query must be object');
      return this._apiRequest('/group/' + groupId + '/events', 'GET', PieceMakerApi._convertData(query), PieceMakerApi._fixEventsResponse);
    }

    // ###Get one event by id

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/event/GET_api_version_event_id_format

    // ```
    // api.getEvent( <int> eventId )
    // ```

    // Returns promise yielding one event

  }, {
    key: 'getEvent',
    value: function getEvent(eventId) {
      _assert2.default.equal(typeof eventId === 'undefined' ? 'undefined' : _typeof(eventId), 'number', 'eventId must be number');
      return this._apiRequest('/event/' + eventId, undefined, PieceMakerApi._expandEventToObject);
    }

    // ###Create one event

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/group/POST_api_version_group_id_event_format

    // ```
    // api.createEvent( <int> groupId, <object> eventData )
    // ```
    // Where *eventData* is:
    // ```
    // {
    //    utc_timestamp: <date>,
    //    duration:      <int>,
    //    type:          <string>,
    //    // optionally:
    //    fields: {
    //        key1 : value1,
    //        key2 : value2,
    //        ...
    //     }
    // }
    // ```

    // Returns promise yielding the newly created event

  }, {
    key: 'createEvent',
    value: function createEvent(groupId, eventData) {
      _assert2.default.equal(typeof groupId === 'undefined' ? 'undefined' : _typeof(groupId), 'number', 'groupId must be number');
      _assert2.default.equal(typeof eventData === 'undefined' ? 'undefined' : _typeof(eventData), 'object', 'eventData must be object');
      return this._apiRequest('/group/' + groupId + '/event', 'POST', eventData, PieceMakerApi._expandEventToObject);
    }

    // ###Update one event

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/event/PUT_api_version_event_id_format

    // ```
    // api.updateEvent( <int> eventId, <object> eventData )
    // ```
    // Where *eventData* is:
    // ```
    // {
    //    utc_timestamp: <date>,
    //    duration:      <int>,
    //    type:          <string>,
    //    // optionally:
    //    fields: {
    //        key1 : value1,
    //        key2 : value2,
    //        ...
    //     }
    // }
    // ```

    // Returns promise yielding the updated event

  }, {
    key: 'updateEvent',
    value: function updateEvent(eventId, eventData) {
      _assert2.default.equal(typeof eventId === 'undefined' ? 'undefined' : _typeof(eventId), 'number', 'eventId must be number');
      _assert2.default.equal(typeof eventData === 'undefined' ? 'undefined' : _typeof(eventData), 'object', 'eventData must be object');
      return this._apiRequest('/event/' + eventId, 'PUT', eventData, PieceMakerApi._expandEventToObject);
    }

    // ###Delete one event

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/event/DELETE_api_version_event_id_format

    // ```
    // api.deleteEvent( <int> eventId )
    // ```

    // Returns promise

  }, {
    key: 'deleteEvent',
    value: function deleteEvent(eventId) {
      _assert2.default.equal(typeof eventId === 'undefined' ? 'undefined' : _typeof(eventId), 'number', 'eventId must be number');
      return this._apiRequest('/event/' + eventId, 'DELETE');
    }

    // System related calls
    // ---------------------

    // ###Get the system (server) time

    // See:
    // http://motionbank.github.io/piecemaker2-api/swagger/#!/system/GET_api_version_system_utc_timestamp_format

    // ```
    // api.getSystemTime()
    // ```

    // Returns promise yielding UTC timestamp (date) of server

  }, {
    key: 'getSystemTime',
    value: function getSystemTime() {
      return this._apiRequest('/system/utc_timestamp', 'GET', undefined, function (res) {
        return new Date(res.utc_timestamp * 1000);
      });
    }

    //
    //
    // Internals

  }, {
    key: '_apiRequest',
    value: function _apiRequest(path) {
      var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'GET';
      var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      var resultHandler = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

      var _ctx = this;
      return new Promise(function (resolve, reject) {
        var req = (0, _superagent2.default)(method, '' + _ctx.host + path).accept('application/json').set('Content-Type', 'application/json; charset=utf-8');
        if (typeof _ctx.api_access_key === 'string') {
          req.set('X-Access-Key', _ctx.api_access_key);
        }
        if (data) req.send(data);
        req.end(function (err, res) {
          if (err || !res.ok) return reject(new PMApiError(err.message, res.status, path, method));
          if (typeof resultHandler === 'function') {
            return resolve(resultHandler(res.body));
          }
          resolve(res.body);
        });
      });
    }

    //
    //
    // Statics

  }], [{
    key: '_convertData',
    value: function _convertData(data) {
      if (!data) return data;
      if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object') return data;
      if ('entrySet' in data && typeof data.entrySet === 'function') {
        // var allowed_long_keys = ['utc_timestamp', 'duration', 'type', 'token'];
        var set = data.entrySet();
        if (!set) return data;
        var obj = {};
        var iter = set.iterator();
        while (iter.hasNext()) {
          var entry = iter.next();
          var val = entry.getValue();
          if (val && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && 'entrySet' in val && typeof val.entrySet === 'function') val = PieceMakerApi._convertData(val);
          var key = entry.getKey();
          if (!key) {
            throw new Error('Field key is not valid: ' + key);
          }
          obj[entry.getKey()] = val;
        }
        return obj;
      } else {
        if ('utc_timestamp' in data) data.utc_timestamp = PieceMakerApi._jsDateToTs(data.utc_timestamp);
        if ('created_at' in data) data.created_at = PieceMakerApi._jsDateToTs(data.created_at);
      }
      return data;
    }

    // FIXME: these are temporary fixes for:
    // https://github.com/motionbank/piecemaker2/issues/54
    // https://github.com/motionbank/piecemaker2-api/issues/105

  }, {
    key: '_fixEventsResponse',
    value: function _fixEventsResponse(resp) {
      if (resp instanceof Array) {
        var arr = [];
        for (var i = 0; i < resp.length; i++) {
          arr.push(PieceMakerApi._expandEventToObject(resp[i]));
        }
        return arr;
      }
      return resp;
    }
  }, {
    key: '_expandEventToObject',
    value: function _expandEventToObject(event) {
      if (event.fields && event.fields.length > 0) {
        // fix JSON formatting
        var newFields = {};
        for (var i = 0, f = event.fields, l = f.length; i < l; i++) {
          var field = f[i];
          newFields[field['id']] = field['value'];
        }
        event.fields = newFields;
        // add a fake getter to make Processing.js happy
        event.fields.get = function (e) {
          return function (k) {
            return e.fields[k];
          };
        }(event);
      }
      event.utc_timestamp = new Date(event.utc_timestamp * 1000.0);
      return event;
    }
  }, {
    key: '_jsDateToTs',
    value: function _jsDateToTs(dateTime) {
      if (dateTime instanceof Date) {
        return dateTime.getTime() / 1000.0;
      } else {
        if (dateTime > 9999999999) {
          return dateTime / 1000.0; // assume it's a JS timestamp in ms
        } else {
          return dateTime; // assume it's ok
        }
      }
    }
  }, {
    key: 'TIMESPAN',
    value: function TIMESPAN() {
      return 'utc_timestamp';
    }
  }, {
    key: 'INTERSECTING',
    get: function get() {
      return 'intersect';
    }
  }, {
    key: 'CONTAINED',
    get: function get() {
      return 'contain';
    }
  }]);

  return PieceMakerApi;
}();

var PMApiError = function (_Error) {
  _inherits(PMApiError, _Error);

  // Custom API Error class
  function PMApiError(msg) {
    var code = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
    var url = arguments[2];
    var type = arguments[3];

    _classCallCheck(this, PMApiError);

    var _this = _possibleConstructorReturn(this, (PMApiError.__proto__ || Object.getPrototypeOf(PMApiError)).call(this, msg));

    _this.code = code;
    _this.url = url;
    _this.type = type;
    Error.captureStackTrace(_this, PMApiError);
    return _this;
  }

  return PMApiError;
}(Error);

if (typeof window !== 'undefined') {
  window.PieceMakerApi = PieceMakerApi;
}

exports.default = PieceMakerApi;

},{"assert":1,"superagent":4}]},{},[13]);
