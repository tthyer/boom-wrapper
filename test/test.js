'use strict';

const Boom = require('boom');
const test = require('tape');
const boomWrap = require('../');

const internals = {};
internals.error = { statusCode: 418, message: 'But you do know I\'m a teapot?', data: 'Teapot Error' };

test('wrap-error: reformats Boom data', function(t) {
  let error = internals.error;
  let boom = Boom.create(error.statusCode, error.message, error.data);
  let wrapped = boomWrap(boom);
  t.ok(wrapped.isBoom, 'it is a Boom,');
  t.equal(wrapped.output.payload.statusCode, error.statusCode, 'it has the specified status code,');
  t.ok(wrapped.output.payload.data, 'it has data on the payload,');
  t.equal(wrapped.output.payload.data, error.data, 'and it is the expected data.'); 
  t.end();
});

test('wrap-error: moves the Error message to payload data', function(t) {
  let error = internals.error;
  let wrapped = boomWrap(new Error(error.data));
  t.ok(wrapped.isBoom, 'it is a Boom,');
  t.equal(wrapped.output.payload.statusCode, 500, 'it returned the default status code,');
  t.ok(wrapped.output.payload.data, 'it has data on the payload,');
  t.equal(wrapped.output.payload.data, error.data, 'and it is the expected data.'); 
  t.end();
});

test('wrap-error: creates a Boom from a String', function(t) {
  let error = internals.error;
  let wrapped = boomWrap(error.data);
  t.ok(wrapped.isBoom, 'it is a Boom,');
  t.equal(wrapped.output.payload.statusCode, 500, 'it returned the default status code,');
  t.ok(wrapped.output.payload.data, 'it has data on the payload,');
  t.equal(wrapped.output.payload.data, error.data, 'and it is the expected data.'); 
  t.end();
});

test('wrap-error: produces readable string from object data', function(t) {
  let error = internals.error;
  let data = { teapotError: 'we don\'t server coffee!' };
  let boom = Boom.create(error.statusCode, error.message, data);
  let wrapped = boomWrap(boom);
  t.ok(wrapped.isBoom, 'it is a Boom,');
  t.equal(wrapped.output.payload.statusCode, error.statusCode, 'it returned the default status code,');
  t.ok(wrapped.output.payload.data, 'it has data on the payload,');
  t.equal(wrapped.output.payload.data.teapotError, data.teapotError, 'and it is the expected data.'); 
  t.end();
});
