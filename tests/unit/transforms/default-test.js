import { module, test } from 'qunit';
import transform from 'ember-ohm/transforms/default';

let serialize = function(value) {
  return transform.serialize(null, null, value);
};

let deserialize = function(value) {
  return transform.deserialize(null, null, value);
};

module('Unit | Transforms | default');

// --------------------------------------------------------
// Serialize

test("serialize simply returns any value", function(assert) {
  var value = serialize(1);
  assert.equal(value, 1);

  value = serialize('abc');
  assert.equal(value, 'abc');

  value = serialize(NaN);
  assert.ok(isNaN(value));

  value = serialize(null);
  assert.equal(value, null);

  value = serialize(undefined);
  assert.equal(value, undefined);

  value = serialize(true);
  assert.equal(value, true);
});

// --------------------------------------------------------
// Deserialize

test("deserialize simply returns any value", function(assert) {
  var value = deserialize(1);
  assert.equal(value, 1);

  value = deserialize('abc');
  assert.equal(value, 'abc');

  value = deserialize(NaN);
  assert.ok(isNaN(value));

  value = deserialize(null);
  assert.equal(value, null);

  value = deserialize(undefined);
  assert.equal(value, undefined);

  value = deserialize(true);
  assert.equal(value, true);
});
