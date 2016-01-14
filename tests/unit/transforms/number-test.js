import { module, test } from 'qunit';
import transform from 'ember-ohm/transforms/number';

let serialize= function(value) {
  return transform.serialize(null, null, value);
};

module('Unit | Transform | number');

// --------------------------------------------------------
// Only test serialize

test("converts Numbers correctly", function(assert) {
  var value = serialize(1);
  assert.equal(value, 1);

  value = serialize(0);
  assert.equal(value, 0);

  value = serialize(-1);
  assert.equal(value, -1);
});

test("converts a Strings correctly", function(assert) {
  var value = serialize('1');
  assert.equal(value, 1);

  value = serialize('0');
  assert.equal(value, 0);

  value = serialize('-1');
  assert.equal(value, -1);

  value = serialize('a1');
  assert.ok(isNaN(value));

  value = serialize('abc');
  assert.ok(isNaN(value));
});

test("converts Objects correctly", function(assert) {
  var value = serialize({});
  assert.ok(isNaN(value));
});

test("converts a Ember.isEmpty value as null", function(assert) {
  var value = serialize(null);
  assert.equal(value, null);

  value = serialize(undefined);
  assert.equal(value, null);
});
