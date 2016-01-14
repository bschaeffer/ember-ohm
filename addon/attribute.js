import Ember from 'ember';
import Changes from './utils/changes';
import lookupTransform from './utils/lookup-transform';

const {get, set, meta, isEmpty} = Ember;

/**
  @module ember-ohm
*/

const DEFAULTS = {
  defaultValue: undefined,
  readOnly: false
};

let handleComputed = function(options, key, value) {
  let data = get(this, '_data');
  let dataValue = get(data || {}, key);
  let changes = get(this, '_changes');
  const creating = meta(this).proto === this;

  // Ensure the _data property is set correctly
  if (!data) {
    data = {};
    set(this, '_data', data);
  }

  // Ensure the _changes property is set correctly
  if (!changes) {
    changes = Changes.create({record: this});
    set(this, '_changes', changes);
  }

  if (!isEmpty(value)) {
    if (creating) {
      if (!options.readOnly) { changes.setKeyChanged(key, false); }
      dataValue = set(data, key, value);
    }

    if (dataValue !== value) {
      if (!options.readOnly) {
        if (!changes.has(key)) {
          changes.set(key, dataValue);
        } else if (changes.get(key) === value) {
          changes.remove(key);
        }
      }

      dataValue = set(data, key, value);
    } else if (!options.readOnly) {
      changes.remove(key);
    }
  } else {
    if (typeof dataValue === 'undefined') {
      dataValue = set(data, key, options.defaultValue);
    }
  }

  const transform = lookupTransform(this, options.type);
  return transform.deserialize(this, options, dataValue);
};

/**
  `attr` defines an attribute on an `Ember.Object`.

  `attr` takes an optional first paramter as a string which defines
  the {{#crossLink "Serializers:class"}}serializer{{/crossLink}} used
  to serialize/deserialize the attribute value. Available serializers are
  `default`, `boolean`, `number` and `string`, but you always register your
  own.

  It takes an optional hash as a second parameter also. Supported options are:

  * `defaultValue`: The default value of the attribute if none is supplied.
  * `readOnly`: Whether to track changes or serialize this attribute.

  @method attr
  @for Ohm
  @param {String} [type=default] The serializer to use. Can be one of `default`,
    `boolean`, `number`, `string`, or any custom serializer.
  @param {Object} [options] The attribute options.
*/
export default function(type, options) {
  if (arguments.length !== 2) {
    if (typeof type === 'object') {
      options = type;
      type = 'default';
    } else if (typeof type === 'undefined') {
      type = 'default';
    }
  }

  options = Ember.$.extend({}, DEFAULTS, options);
  const metaAtts = {isAttribute: true, type: type, options: options};

  return Ember.computed('_data', {
    get(key) {
      return handleComputed.call(this, options, key);
    },
    set(key, value) {
      return handleComputed.call(this, options, key, value);
    }
  }).meta(metaAtts);
}
