import Ember from 'ember';
import { module, test } from 'qunit';
import Ohm from 'ember-ohm/model';
import buildContainer from '../helpers/build-container';

let model, Model;

Model = Ohm.extend({
  container: buildContainer(),
  name: Ohm.attr(),
  age:  Ohm.attr('number'),
  xp:   Ohm.attr('number', {readOnly: true})
});

module('Unit | model', {
  setup: function() {
    Ember.run(function() {
      model = Model.create({
        name: 'Joe First',
        age:  '28',
        xp:   '9000'
      });
    });
  }
});

// ---------------------------------------------------------
// isDirty & isClean

test('should be clean with no changes present', function(assert) {
  assert.notOk(model.get('isDirty'), 'model should not be dirty');
  assert.ok(model.get('isClean'), 'model should be clean');
});

test('should be dirty with changes present', function(assert) {
  Ember.run(function() {
    model.set('name', 'Ember Ohm');
  });

  assert.ok(model.get('isDirty'), 'model should be dirty');
  assert.notOk(model.get('isClean'), 'model should not be clean');
});

// ---------------------------------------------------------
// revert & commit

test("#revert", function(assert) {
  Ember.run(function() {
    model.set('name', 'Ember Ohm');
  });

  model.revert();

  assert.equal(model.get('name'), 'Joe First');
  assert.notOk(model.get('isDirty'), 'model should not be dirty');
  assert.ok(model.get('isClean'), 'model should be clean');
  assert.notOk(model.get('nameChanged'), 'name should not have changed');

  Ember.run(function() {
    model.setProperties({
      name: 'Woparo Diskerdont',
      age: '23'
    });
  });

  model.revert('name');

  assert.equal(model.get('name'), 'Joe First');
  assert.notOk(model.get('nameChanged'), "name should not be changed");
  assert.ok(model.get('ageChanged'), "age should be changed");
  assert.ok(model.get('isDirty'), "model should be dirty");
});

test("#commit", function(assert) {
  Ember.run(function() {
    model.set('name', 'Ember Ohm');
  });

  model.commit();

  assert.equal(model.get('name'), 'Ember Ohm');
  assert.notOk(model.get('isDirty'), 'model should not be dirty');
  assert.ok(model.get('isClean'), 'model should be clean');
  assert.notOk(model.get('nameChanged'), 'name should not have changed');

  Ember.run(function() {
    model.setProperties({
      name: 'Woparo Diskerdont',
      age: 42,
      xp: 100000
    });
  });

  model.commit('name');

  assert.equal(model.get('name'), 'Woparo Diskerdont');
  assert.notOk(model.get('nameChanged'), 'model\'s name should not be changed');
  assert.ok(model.get('ageChanged'), 'age should be changed');

  model.commit('age');

  assert.notOk(model.get('ageChanged'), 'age should not be changed');
  assert.ok(model.get('isClean'), 'model should be clean');
});

// ---------------------------------------------------------
// getAttributeKeys & getAttributes

test("#getAttributeKeys", function(assert) {
  var keys = model.getAttributeKeys();
  assert.deepEqual(keys, ['name', 'age', 'xp'], "model did not have correct attribute keys");
});

test("#getAttributes", function(assert) {
  let test = model.getProperties('name', 'age', 'xp');
  let atts = model.getAttributes();

  assert.deepEqual(test, atts);
});

// ---------------------------------------------------------
// getChangedKeys & getChanges

test("#getChangedKeys", function(assert) {
  let keys;

  Ember.run(function() {
    model.set('name', 'Other Name');
    model.set('age', '45');
  });

  keys = model.getChangedKeys();
  assert.deepEqual(keys, ['name', 'age'], "model did not have correct changed keys");
});

test("#getChanges", function(assert) {
  Ember.run(function() {
    model.set('name', 'Other Name');
    model.set('age',  '45');
  });

  const test = model.serialize('name', 'age');
  const atts = model.getChanges(true);

  assert.deepEqual(test, atts);
});

// ---------------------------------------------------------
// serialize

test("#serialize", function(assert) {
  var test = model.serialize();
  assert.deepEqual(test, {name: 'Joe First', age: 28});

  test = model.serialize('name');
  assert.deepEqual(test, {name: 'Joe First'});

  // Read-Only serialization
  test = model.serialize('xp');
  assert.deepEqual(test, {xp: 9000});
});
