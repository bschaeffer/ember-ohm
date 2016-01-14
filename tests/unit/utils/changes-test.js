import Ember from 'ember';
import Changes from 'ember-ohm/utils/changes';
import { module, test } from 'qunit';

let record, changes;

module('Unit | Utils | changes', {
  setup() {
    record  = Ember.Object.create();
    changes = Changes.create({record: record});
  }
});

test('stores changes', function(assert) {
  const key = 'key';
  const value = 'anything';

  Ember.run(function() {
    changes.set(key, value);
  });

  assert.ok(changes.has(key), 'changes should include key');
  assert.equal(value, changes.get(key));

  Ember.run(function() {
    changes.remove(key);
  });

  assert.ok(!changes.has(key), 'changes should not include key');
});

test('sets changes on the record', function(assert) {
  const key = 'key';
  const keyChanged =  'keyChanged';
  const value = 'anything';

  Ember.run(function() {
    changes.set(key, value);
  });

  assert.ok(record.get(keyChanged), 'record.key_changed should be true');

  Ember.run(function() {
    changes.remove(key);
  });

  assert.ok(!record.get(keyChanged), 'record.key_changed should be false');
});

test('iterates with forEach', function(assert) {
  const atts = {one: 'hello', two: 'world'};

  assert.expect(2);

  Ember.run(function() {
    changes.set('one', atts.one);
    changes.set('two', atts.two);
  });

  changes.forEach(function(value, key) {
    assert.equal(atts[key], value);
  });
});

test('clears all changes', function(assert) {
  const map = Ember.get(changes, 'map');

  changes.set('first', 'hello');
  changes.set('second', 'world');

  changes.clear();
  assert.equal(map.size, 0);
});

test('clears specific changes', function(assert) {
  const map = Ember.get(changes, 'map');

  changes.set('first', 'hello');
  changes.set('second', 'world');
  changes.clear('second');

  assert.equal(map.size, 1);
  assert.equal(changes.get('first'), 'hello');
});
