import { module, test } from 'qunit';
import transform from 'ember-ohm/transforms/boolean';

let serialize = function(value) {
  return transform.serialize(null, null, value);
};

let deserialize = function(value) {
  return transform.deserialize(null, null, value);
};

module('Unit | Transform | boolean');

// --------------------------------------------------------
// Serialize

test("serializes a Boolean correctly", function(assert) {
  var value = serialize(true);
  assert.equal(value, true);

  value = serialize(false);
  assert.equal(value, false);
});

test("serializes a Numbers correctly", function(assert) {
  var value = serialize(1);
  assert.equal(value, true);

  value = serialize(45);
  assert.equal(value, true);

  value = serialize(0);
  assert.equal(value, false);

  value = serialize(-1);
  assert.equal(value, true);
});

test("serializes Strings correctly", function(assert) {
  var value = serialize('abc');
  assert.equal(value, true);

  value = serialize('');
  assert.equal(value, false);
});

test("serializes Objects correctly", function(assert) {
  var value = serialize({});
  assert.equal(value, true);
});

test("serializes Null-like values correctly", function(assert) {
  var value = serialize(null);
  assert.equal(value, false);

  value = serialize(undefined);
  assert.equal(value, false);
});

// --------------------------------------------------------
// Deserialize

test("deserializes Booleans correctly", function(assert) {
  var value = deserialize(true);
  assert.equal(value, true);

  value = deserialize(false);
  assert.equal(value, false);
});

test("deserializes Numbers correctly 1 as true", function(assert) {
  var value = deserialize(1);
  assert.equal(value, true);

  value = deserialize(45);
  assert.equal(value, false);

  value = deserialize(0);
  assert.equal(value, false);

  value = deserialize(-1);
  assert.equal(value, false);

  value = deserialize(NaN);
  assert.equal(value, false);
});

test("deserializes Strings correctly", function(assert) {
  var value = deserialize('true');
  assert.equal(value, true);

  value = deserialize('t');
  assert.equal(value, true);

  value = deserialize('1');
  assert.equal(value, true);

  value = deserialize('anythingelse');
  assert.equal(value, false);
});

test("deserializes anything else as false", function(assert) {
  var value = deserialize({});
  assert.equal(value, false);

  value = deserialize(null);
  assert.equal(value, false);

  value = deserialize(undefined);
  assert.equal(value, false);
});
