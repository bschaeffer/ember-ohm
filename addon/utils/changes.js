import Ember from 'ember';

const { get, copy } = Ember;
const camelize = Ember.String.camelize;

/**
  `Changes` tracks changes for attributes declared using various
  methods (i.e, {{#crossLink "Ohm/attr:method"}}`Ohm.attr`{{/crossLink}}
  and {{#crossLink "Ohm/arrayAttr:method"}}`Ohm.arrayAttr`{{/crossLink}})

  @private
  @module ember-ohm
  @class Changes
*/
export default Ember.Object.extend({
  /**
    Stores the original value of an attribute defined on the stored
    {{#crossLink "Changes/record:property"}}`record`{{/crossLink}}
    as `attribute => original`.

    It is done this way so that `Model` can retain changes as current
    property values, then, when asked to, return the model to it's original
    state using the values stored in this mapping.

    @private
    @property map
    @type {Ember.Map}
  */
  map: null,

  /**
    The record for which changes are being tracked. This property should be set
    once the class is instantiated.

    @private
    @property record
    @type {Ohm.Model}
  */
  record: null,

  /**
    The initialzer simple ensures that the
    {{#crossLink "Changes/map:property"}}`map`{{/crossLink}}
    property is set to a `Ember.Map`.

    @method init
  */
  init() {
    this._super(...arguments);
    this.map = Ember.Map.create();
  },

  /**
    Attempts to return the value for a changed attribute.

    @private
    @method get
    @param {String} key The property to lookup.
    @return {Mixed} The variable value of the changed property.
  */
  get(key) {
    return this.map.get(key);
  },

  /**
    Whether we have any cached original values for an attribute.

    @private
    @method has
    @param {String} key   The property to check.
    @return {Boolean} Whether we have a cached value or not.
  */
  has(key) {
    return this.map.has(key);
  },

  /**
    Caches the original value for an attribute. Any call to this method also
    sets the `{key}_changed` property to `true` on the
    {{#crossLink "Changes/record:property"}}`record`{{/crossLink}}.

    @private
    @method set
    @param {String} key   The property to set.
    @param {String} value The original value of the property.
  */
  set(key, value) {
    this.map.set(key, value);
    this.setKeyChanged(key, true);
  },

  /**
    Removes the cached original value for an attribute. Any call to this method
    also sets the `{key}_changed` property to `false` on the
    {{#crossLink "Changes/record:property"}}`record`{{/crossLink}}.

    @private
    @method remove
    @param {String} key   The property to remove.
  */
  remove(key) {
    this.map.delete(key);
    this.setKeyChanged(key, false);
  },

  /**
    Duplicates the functionality of `Ember.Map#forEach`.

    @private
    @method forEach
    @param {Function} callback The method to use for mapping.
    @param {Object}   [self]   The value of `this` in the `callback`.
  */
  forEach(callback, binding) {
    this.map.forEach(callback, binding);
  },

  /**
    Calls {{#crossLink "Changes/remove:method"}}`remove`{{/crossLink}}
    for each of the cached values.

    If a list of attributes are passed as arguments, only those are removed.

    @private
    @method clear
    @param  {String} [atts]* Optional list of attribute keys to clear
  */
  clear() {
    let keys;

    if (arguments.length > 0) {
      keys = [].slice.call(arguments, 0);
    } else {
      keys = copy(this.map._keys.list);
    }

    keys.forEach(this.remove, this);
  },

  /**
    Sets the value of `{key}_changed` on the record based on the given `value`.

    @private
    @method setKeyChanged
    @param {String}  key   The property to set.
    @param {Boolean} value Whether the property changed or not.
  */
  setKeyChanged(key, value) {
    const changedKey = camelize(key + '_changed');
    const record = get(this, 'record');

    record.set(changedKey, value);
    record.set('isDirty', (this.map.size > 0));
  }
});
