import { module, test } from 'qunit';
import transform from 'ember-ohm/transforms/string';

let serialize = function(value) {
  return transform.serialize(null, null, value);
};

module('Unit | Transform | string');

// --------------------------------------------------------
// Only test serialize

test("converts any non-Ember.isNone value as a String", function(assert) {
  let value = serialize(1);
  assert.equal(value, '1');

  value = serialize(0);
  assert.equal(value, '0');

  value = serialize(-1);
  assert.equal(value, '-1');

  value = serialize('abc');
  assert.equal(value, 'abc');

  value = serialize('');
  assert.equal(value, '');

  value = serialize(true);
  assert.equal(value, 'true');

  value = serialize(false);
  assert.equal(value, 'false');

  value = serialize({});
  assert.equal(value, '[object Object]');

  value = serialize({toString: function() {return 'Test';}});
  assert.equal(value, 'Test');
});

test("converts any Ember.isNone value as a null", function(assert) {
  let value = serialize(null);
  assert.equal(value, null);

  value = serialize(undefined);
  assert.equal(value, null);
});

test("converts NaN as a String", function(assert) {
  let value = serialize(NaN);
  assert.equal(value, 'NaN');
});
