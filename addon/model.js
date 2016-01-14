import Ember from 'ember';
import attribute from './attribute';
import lookupTransform from './utils/lookup-transform';

const { get } = Ember;

/**
  @module ember-ohm
*/

const Model = Ember.Object.extend({
  /**
    `isDirty` defines whether any of the model's attributes defined using one
    of the `Ohm` attribute methods have changed.

    Privately, it is computed from the length of the model's
    {{#crossLink "Changes"}}changes{{/crossLink}}.

    @property isDirty
    @type Boolean
  */
  isDirty: false,

  /**
    `isClean` is simply computed from `Ember.computed.not('isDirty')`.
    Using basic maths, this is the opposite of
    {{#crossLink "Model/isDirty:property"}}`isDirty`{{/crossLink}}.

    @property isClean
    @type Boolean
  */
  isClean: Ember.computed.not('isDirty'),

  /**
    Commits any changed attributes to their new values, removing the model from
    the `isDirty` state and clearing the changes tracked on that attribute.

      Model = Ohm.extend({
        name: Ohm.attr(),
        cool: Ohm.attr('boolean')
      });

      model = Model.create({
        name: 'Ember Ohm',
        cool: true
      });

      model.set('name', 'Ember Ohm');
      model.getChanges();   // => {name: 'Ember Ohm'}
      model.get('name');    // => 'Ember Ohm'
      model.get('isDirty'); // => true

      model.commit();
      model.getChanges();   // => {}
      model.get('name');    // => 'Ember Ohm'
      model.get('isDirty'); // => false

    You may also pass a variable list of attribute keys to commit:

      model.setProperties({
        name: 'Ember Ohm',
        cool: true
      });

      model.getChanges();   // => {name: 'Ember Ohm', cool: true}
      model.get('isDirty'); // => true

      model.commit('name');
      model.get('name');    // => 'Ember Ohm'
      model.getChanges();   // => {cool: true}
      model.get('isDirty'); // => true

    @method commit
    @param  {Array} [atts]* Optional list of attribute keys to commit
  */
  commit: function() {
    if (!this.get('isDirty')) { return; }
    var changes = this.get('_changes');
    changes.clear.apply(changes, arguments);
  },

  /**
    Reverts any changed attributes to their original values,  removing the
    model from the `isDirty` state and clearing the changes tracked on that
    attribute.

      Model = Ohm.extend({
        name: Ohm.attr(),
        cool: Ohm.attr('boolean')
      });

      model = Model.create({
        name: 'Ember Data',
        cool: false
      });

      model.set('name', 'Ember Ohm');
      model.getChanges();   // => {name: 'Ember Ohm'}
      model.get('name');    // => 'Ember Ohm'
      model.get('isDirty'); // => true

      model.revert();
      model.getChanges();   // => {}
      model.get('name');    // => 'Ember Data'
      model.get('isDirty'); // => false

    You may also pass a variable list of attribute keys to revert:

      model.setProperties({
        name: 'Ember Ohm',
        cool: true
      });

      model.getChanges();   // => {name: 'Ember Ohm', cool: true}
      model.get('isDirty'); // => true

      model.revert('name');
      model.get('name');    // => "Ember Data"
      model.getChanges();   // => {cool: true}
      model.get('isDirty'); // => true

    @method revert
    @param  {Array} [atts]* Optional list of attribute keys to revert
  */
  revert: function() {
    if (!this.get('isDirty')) { return; }

    let atts;
    const changes = this.get('_changes');

    if (arguments.length > 0) {
      atts = Ember.A([].slice.call(arguments, 0));
    }

    changes.forEach(function(value, key) {
      if (atts && !atts.contains(key)) { return; }
      this.set(key, value);
      changes.remove(key);
    }, this);
  },

  /**
    Returns an array where each element in the array corresponds to a key that
    was defined using an attribute method.

      Model = Ohm.extend({
        name: Ohm.attr(),
        age:  Ohm.attr(),
        xp:   Ohm.attr({readOnly: true})
      });

      model = Model.create();
      model.getAttributeKeys(); // => ['name', 'age', 'xp'];

    @method getAttributeKeys
    @return {Array} An array containing all the attribute keys.
  */
  getAttributeKeys() {
    var atts = get(this.constructor, 'attributes');
    return get(atts, '_keys.list');
  },

  /**
    Returns an object of attribute keys and values.

      Model = Ohm.extend({
        name: Ohm.attr('string'),
        age:  Ohm.attr('number'),
        xp:   Ohm.attr('number', {readOnly: true})
      });

      model = Model.create({name: 'Braden', age: '28', xp: '9000'});
      model.getAttributes();     // => {name: 'Braden', age: '28', xp: '9000'};

    If you pass `true` as the first argument, the values will be serialized,
    other wise we return the results of `Ember.Object#getProperties`.

    @method getChanges
    @return {Object} The object attribute key/values.
  */
  getAttributes() {
    const keys = this.getAttributeKeys();
    return this.getProperties.apply(this, keys);
  },

  /**
    Returns an array where each element in the array corresponds to a key that
    was defined using an attribute method and whose value has been changed.

        Model = Ohm.extend({ name: Ohm.attr() });
        model = Model.create({name: 'Braden'});
        model.getChangedKeys();     // => []
        model.set('name', 'Ralph');
        model.getChangedKeys();     // => ['name']

    @method getChangedKeys
    @return {Array} An array containing all the changed attributes.
  */
  getChangedKeys() {
    return this.get('_changes.map._keys.list');
  },

  /**
    Returns an object of changes whose keys are changed attribute names and
    whose values are their current values.

        Model = Ohm.extend({
          name: Ohm.attr('string'),
          age:  Ohm.attr('number'),
        });

        model = Model.create({name: 'Braden', age: '28'});

        model.set('name', 'Ralph');
        model.getChanges(); // => {name: 'Ralph'}

        model.set('age', '30');
        model.getChanges();     // => {name: 'Ralph', age: '30'}

    If you pass `true` as the first argument, the values will be serialized,
    other wise we return the results of `Ember.Object#getProperties`.

    @method getChanges
    @param  {Boolean} [serialize] Whether or not we should serialize the
      values.
    @return {Object} The object of changed keys and their serialized values.
  */
  getChanges() {
    const keys = this.getChangedKeys();
    return this.serialize.apply(this, keys);
  },

  /**
    Serializes the model properties that were defined using any of the
    attribute methods using the options given during definition. `readOnly`
    attributes are only observed if this method is called without any attribute
    keys as arguments.

        Model = Ohm.extend({
          name: Ohm.attr('string'),
          age:  Ohm.attr('number'),
          xp:   Ohm.attr('number', {readOnly: true})
        });

        model = Model.create({
          name: 'Braden',
          age:  '28',
          xp:   99000,
        });

        model.serialize();            // => {name: 'Braden', age: 28}
        model.serialize('xp', 'age'); // => {xp: 99000, age: 28}

    @method serialize
    @param {String} [atts]* The attributes to serialize. If no arguments
      are passed, it serializes all attributes on the model.
    @return {Object} The object of model attributes and their serialized values.
  */
  serialize() {
    const klass = this.constructor;
    const serialized = {};
    let observeReadOnly = true;
    let atts;

    if (arguments.length === 0) {
      atts = get(klass, 'attributes');
    } else {
      atts = Ember.Map.create();
      observeReadOnly = false;
      [].slice.apply(arguments).forEach(function(key) {
        let attr = klass.getAttribute(key);
        atts.set(attr.name, attr);
      });
    }

    atts.forEach((meta, key) => {
      if (!observeReadOnly || !meta.options.readOnly) {
        let value = this.get(key);
        const transform = lookupTransform(this, meta.type);
        serialized[key] = transform.serialize(this, meta.options, value);
      }
    });

    return serialized;
  },
});

Model.reopenClass({

  /**
    @method attr
    @param {String} type The attribute type.
    @param {Object} options The attribute options.
    @return {Ember.Computed}
  */
  attr: attribute,

  /**
    @private
    @property attributes
    @type {Ember.Map}
  */
  attributes: Ember.computed(function() {
    var map = Ember.Map.create();

    this.eachComputedProperty(function(name, meta) {
      if (meta.isAttribute) {
        meta.name = name;
        map.set(name, meta);
      }
    });

    return map;
  }),

  /**
    @private
    @method getAttribute
    @param {String} key The attribute name.
    @return {Object} The attribute meta data.
  */
  getAttribute(key) {
    const atts = get(this, 'attributes');
    return atts.get(key);
  }
});

export default Model;
