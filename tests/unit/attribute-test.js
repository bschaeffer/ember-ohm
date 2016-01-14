import Ember from 'ember';
import { module, test } from 'qunit';
import attr from 'ember-ohm/attribute';
import buildContainer from '../helpers/build-container';

let Model;

module('Unit | attributes', {
  needs: [
    'ember-ohm@transforms:default',
  ],
  setup() {
    Model = Ember.Object.extend({
      container: buildContainer(),
      asDefault: attr(),
      asNumber: attr('number'),
      withDefault: attr({defaultValue: 'default'}),
      readOnly: attr({readOnly: true})
    });
  }
});

// ---------------------------------------
// Default attribute

test("attribute with no initial value", function(assert) {
  let model;

  Ember.run(function() {
    model = Model.create();
  });

  assert.notOk(model.get('asDefaultChanged'), 'asDefault should not have changed');
});

test("attribute with initial value", function(assert) {
  var model;

  Ember.run(function() {
    model = Model.create({asDefault: 'anything'});
  });

  assert.notOk(model.get('asDefaultChanged'), 'asDefault should not have changed');
});

// ---------------------------------------
// Attribute with default value

test("it handles attributes with a defaultValue", function(assert) {
  var model;

  Ember.run(function() {
    model = Model.create();
  });

  assert.equal(model.get('withDefault'), 'default');
  assert.ok(!model.get('withDefaultChanged'), 'withDefault should not have changed');

  Ember.run(function() {
    model = Model.create({withDefault: 'anything'});
  });

  assert.equal(model.get('withDefault'), 'anything');
  assert.notOk(model.get('withDefaultChanged'), 'withDefault should not have changed');
});

// ---------------------------------------
// Changing Values

test("it handles changes when setting values", function(assert) {
  let model;

  Ember.run(function(){
    model = Model.create({asDefault: 'anything'});
  });

  model.set('asDefault', 'somethingElse');
  assert.equal(model.get('asDefault'), 'somethingElse');
  assert.ok(model.get('asDefaultChanged'), 'asDefault should have changed');


  Ember.run(function() {
    model.set('asDefault', 'anything');
  });

  assert.equal(model.get('asDefault'), 'anything');
  assert.notOk(model.get('asDefaultChanged'), 'asDefault should not be changed when setting to original value');
});

test("it handles readOnly values", function(assert) {
  let model;

  Ember.run(function(){
    model = Model.create({readOnly: 'example'});
    assert.notOk(model.get('readOnlyChanged'), 'readOnly values do not change');
  });

  Ember.run(function() {
    model.set('readOnly', 'other');
    assert.equal(model.get('readOnly'), 'other');
    assert.notOk(model.get('readOnlyChanged'), 'readOnly values do not change');
  });
});


// ---------------------------------------
// Value Serialization

test("deserializes attribute values correctly", function(assert) {
  var model;
  model = Model.create({number: '123'});
  assert.equal(model.get('number'), 123);
  assert.notOk(model.get('numberChanged'));
});
